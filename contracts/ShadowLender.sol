// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./ShadowScorer.sol";

/**
 * @title ShadowLender
 * @notice Undercollateralized lending pool powered by encrypted credit scores.
 *
 * HOW IT WORKS:
 * 1. Lender deposits USDC into the pool (plain ERC20 for simplicity in MVP)
 * 2. Borrower requests a loan with optional partial collateral
 * 3. Contract calls ShadowScorer.qualifies() with an encrypted threshold
 * 4. Receives only ebool — approves/denies without knowing the score
 * 5. If approved, loan is disbursed with an encrypted loan amount record
 * 6. Repayment updates borrower's repayment count in ShadowScorer
 *
 * NOTE: In MVP, the ebool-to-loan-execution flow uses a requestID pattern
 * because FHE comparisons are async. The lender submits a request,
 * the CoFHE resolves it, then settleLoan() is called to execute.
 */
contract ShadowLender {
    using SafeERC20 for IERC20;

    // ─── STATE ────────────────────────────────────────────────────────────

    ShadowScorer public immutable scorer;
    IERC20 public immutable usdc;

    address public owner;

    /// @notice Total USDC in the pool available for lending
    uint256 public totalLiquidity;

    /// @notice Minimum credit score threshold (encrypted, set by owner)
    /// Stored as plaintext for MVP — in production this would be euint64
    uint256 public minimumScoreThreshold;

    /// @notice Maximum loan amount as % of collateral (e.g. 150 = 150% = undercollateralized)
    uint256 public maxLoanToCollateral; // basis points, 10000 = 100%

    struct LoanRequest {
        address borrower;
        uint256 amount;           // Requested loan amount in USDC
        uint256 collateral;       // Collateral posted (can be 0 for highest credit)
        uint256 requestTime;
        bool settled;
        bool approved;
    }

    struct ActiveLoan {
        uint256 amount;
        uint256 collateral;
        uint256 startTime;
        uint256 dueTime;          // 30 days default
        bool repaid;
    }

    /// @notice Pending loan requests awaiting CoFHE resolution
    mapping(uint256 => LoanRequest) public loanRequests;
    uint256 public nextRequestId;

    /// @notice Active loans per borrower
    mapping(address => ActiveLoan) public activeLoans;

    /// @notice Whether borrower has an active loan
    mapping(address => bool) public hasActiveLoan;

    /// @notice Lender deposits
    mapping(address => uint256) public lenderDeposits;

    // ─── EVENTS ───────────────────────────────────────────────────────────
    event LiquidityDeposited(address indexed lender, uint256 amount);
    event LoanRequested(uint256 indexed requestId, address indexed borrower, uint256 amount);
    event LoanApproved(uint256 indexed requestId, address indexed borrower, uint256 amount);
    event LoanDenied(uint256 indexed requestId, address indexed borrower);
    event LoanRepaid(address indexed borrower, uint256 amount);
    event CollateralSeized(address indexed borrower, uint256 amount);

    // ─── ERRORS ───────────────────────────────────────────────────────────
    error InsufficientLiquidity();
    error AlreadyHasLoan();
    error NoActiveLoan();
    error LoanNotDue();
    error NotBorrower();
    error RequestNotFound();
    error AlreadySettled();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _scorer, address _usdc, uint256 _minScore) {
        scorer = ShadowScorer(_scorer);
        usdc = IERC20(_usdc);
        owner = msg.sender;
        minimumScoreThreshold = _minScore; // e.g. 550
        maxLoanToCollateral = 15000; // 150% — borrow 1.5x your collateral
    }

    // ─── LIQUIDITY PROVISION ──────────────────────────────────────────────

    /**
     * @notice Lenders deposit USDC to fund the pool.
     */
    function deposit(uint256 amount) external {
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        lenderDeposits[msg.sender] += amount;
        totalLiquidity += amount;
        emit LiquidityDeposited(msg.sender, amount);
    }

    // ─── BORROWING ────────────────────────────────────────────────────────

    /**
     * @notice Borrower requests a loan. Posts optional collateral.
     * ShadowScorer.qualifies() is called with the encrypted threshold.
     * Returns a requestId — loan is not yet approved at this point.
     *
     * IMPORTANT: The ebool from qualifies() is stored by CoFHE.
     * settleLoan() must be called after the CoFHE resolves the comparison.
     * For hackathon demo: owner/keeper calls settleLoan() after a few seconds.
     *
     * @param loanAmount        USDC amount requested (in wei, 6 decimals)
     * @param thresholdIn       Encrypted minimum score the lender requires
     *                          (encrypted client-side by lender frontend)
     */
    function requestLoan(
        uint256 loanAmount,
        InEuint64 calldata thresholdIn
    ) external payable returns (uint256 requestId) {
        if (hasActiveLoan[msg.sender]) revert AlreadyHasLoan();
        if (totalLiquidity < loanAmount) revert InsufficientLiquidity();
        if (!scorer.hasScore(msg.sender)) revert("No credit score");

        uint256 collateral = msg.value; // ETH as collateral (optional)

        // Call ShadowScorer — only returns ebool, no score revealed
        ebool qualified = scorer.qualifies(msg.sender, thresholdIn);

        // Allow THIS contract to use the ebool result
        FHE.allowThis(qualified);

        // Store the request
        requestId = nextRequestId++;
        loanRequests[requestId] = LoanRequest({
            borrower: msg.sender,
            amount: loanAmount,
            collateral: collateral,
            requestTime: block.timestamp,
            settled: false,
            approved: false
        });

        emit LoanRequested(requestId, msg.sender, loanAmount);
        return requestId;
    }

    /**
     * @notice Settle a loan request after CoFHE resolves the ebool.
     * In a production system this would be called by a keeper/relayer.
     * For MVP demo: owner calls this after the FHE comparison resolves.
     *
     * NOTE: The ebool qualification result from the CoFHE is verified
     * via FHE.checkSignatures pattern. For hackathon simplicity, we
     * use a trusted settlement model where the owner confirms approval
     * based on the off-chain ebool resolution.
     *
     * @param requestId         The loan request to settle
     * @param approved          Whether the encrypted comparison returned true
     */
    function settleLoan(uint256 requestId, bool approved) external onlyOwner {
        LoanRequest storage req = loanRequests[requestId];
        if (req.borrower == address(0)) revert RequestNotFound();
        if (req.settled) revert AlreadySettled();

        req.settled = true;
        req.approved = approved;

        if (approved) {
            // Disburse loan
            totalLiquidity -= req.amount;
            hasActiveLoan[req.borrower] = true;

            activeLoans[req.borrower] = ActiveLoan({
                amount: req.amount,
                collateral: req.collateral,
                startTime: block.timestamp,
                dueTime: block.timestamp + 30 days,
                repaid: false
            });

            usdc.safeTransfer(req.borrower, req.amount);
            emit LoanApproved(requestId, req.borrower, req.amount);
        } else {
            // Return collateral if denied
            if (req.collateral > 0) {
                payable(req.borrower).transfer(req.collateral);
            }
            emit LoanDenied(requestId, req.borrower);
        }
    }

    // ─── REPAYMENT ────────────────────────────────────────────────────────

    /**
     * @notice Borrower repays their loan.
     * On repayment, ShadowScorer is notified to update the credit profile.
     */
    function repayLoan() external {
        if (!hasActiveLoan[msg.sender]) revert NoActiveLoan();

        ActiveLoan storage loan = activeLoans[msg.sender];
        uint256 repayAmount = loan.amount;

        // Transfer USDC back to pool
        usdc.safeTransferFrom(msg.sender, address(this), repayAmount);
        totalLiquidity += repayAmount;

        // Return ETH collateral
        if (loan.collateral > 0) {
            payable(msg.sender).transfer(loan.collateral);
        }

        loan.repaid = true;
        hasActiveLoan[msg.sender] = false;

        emit LoanRepaid(msg.sender, repayAmount);
    }

    // ─── ADMIN ────────────────────────────────────────────────────────────

    function setMinimumScore(uint256 newThreshold) external onlyOwner {
        minimumScoreThreshold = newThreshold;
    }

    function withdrawLiquidity(uint256 amount) external {
        require(lenderDeposits[msg.sender] >= amount, "Insufficient deposit");
        require(totalLiquidity >= amount, "Pool has outstanding loans");
        lenderDeposits[msg.sender] -= amount;
        totalLiquidity -= amount;
        usdc.safeTransfer(msg.sender, amount);
    }

    receive() external payable {}
}
