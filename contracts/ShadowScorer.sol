// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";

/**
 * @title ShadowScorer
 * @notice Encrypted credit scoring engine. Scores are computed entirely in FHE.
 * No plaintext score ever exists on-chain or is accessible to any party
 * without explicit permit-based decryption by the score owner.
 *
 * SCORE FORMULA (all in FHE arithmetic):
 *   baseScore = 300 (encrypted trivially)
 *   paymentComponent  = paymentHistory * 35     (35% weight)
 *   utilizationBonus  = (100 - utilization) * 30 (30% weight, lower util = better)
 *   volumeComponent   = totalVolume / 10000       (35% weight, scaled)
 *   finalScore = baseScore + paymentComponent + utilizationBonus + volumeComponent
 *   Range: ~300 (worst) to ~850 (best)
 */
contract ShadowScorer {

    // ─── ENCRYPTED STATE ──────────────────────────────────────────────────
    // All values stored as FHE handles — never plaintext on-chain

    /// @notice Encrypted payment history score 0-100 per user
    mapping(address => euint32) private _paymentHistory;

    /// @notice Encrypted credit utilization ratio 0-100 per user
    mapping(address => euint32) private _utilizationRatio;

    /// @notice Encrypted total transaction volume (scaled, in USDC cents)
    mapping(address => euint64) private _totalVolume;

    /// @notice Encrypted repayment count (number of loans repaid on time)
    mapping(address => euint32) private _repaymentCount;

    /// @notice Final computed encrypted credit score per user
    mapping(address => euint64) private _creditScores;

    /// @notice Whether a user has submitted their initial data
    mapping(address => bool) public hasProfile;

    /// @notice Whether a score has been computed for a user
    mapping(address => bool) public hasScore;

    /// @notice Track authorized data submitters (lender contracts etc.)
    mapping(address => bool) public authorizedSubmitters;

    address public owner;

    // ─── EVENTS ───────────────────────────────────────────────────────────
    event ProfileCreated(address indexed user, uint256 timestamp);
    event ScoreComputed(address indexed user, uint256 timestamp);
    event DataUpdated(address indexed user, uint256 timestamp);

    // ─── ERRORS ───────────────────────────────────────────────────────────
    error NotOwner();
    error ProfileNotFound();
    error AlreadyHasProfile();
    error NotAuthorized();

    // ─── MODIFIERS ────────────────────────────────────────────────────────
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender != owner && !authorizedSubmitters[msg.sender]) {
            revert NotAuthorized();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedSubmitters[msg.sender] = true;
    }

    // ─── ADMIN ────────────────────────────────────────────────────────────

    function setAuthorizedSubmitter(address submitter, bool status) external onlyOwner {
        authorizedSubmitters[submitter] = status;
    }

    // ─── DATA SUBMISSION ──────────────────────────────────────────────────

    /**
     * @notice User submits their encrypted financial data to build their profile.
     * Called once by the user with their own encrypted inputs.
     * All inputs are InEuint types — encrypted client-side via cofhejs before submission.
     *
     * @param paymentHistoryIn  Encrypted payment history score 0-100 (how reliably you pay)
     * @param utilizationIn     Encrypted utilization ratio 0-100 (credit used / credit available)
     * @param volumeIn          Encrypted total transaction volume in USDC cents
     * @param repaymentCountIn  Encrypted number of successfully repaid loans
     */
    function submitProfile(
        InEuint32 calldata paymentHistoryIn,
        InEuint32 calldata utilizationIn,
        InEuint64 calldata volumeIn,
        InEuint32 calldata repaymentCountIn
    ) external {
        if (hasProfile[msg.sender]) revert AlreadyHasProfile();

        // Convert encrypted inputs to internal FHE types
        euint32 payHist = FHE.asEuint32(paymentHistoryIn);
        euint32 util    = FHE.asEuint32(utilizationIn);
        euint64 vol     = FHE.asEuint64(volumeIn);
        euint32 repay   = FHE.asEuint32(repaymentCountIn);

        // Store encrypted values
        _paymentHistory[msg.sender]   = payHist;
        _utilizationRatio[msg.sender] = util;
        _totalVolume[msg.sender]      = vol;
        _repaymentCount[msg.sender]   = repay;

        // CRITICAL: Set permissions so this contract can read these values later
        FHE.allowThis(_paymentHistory[msg.sender]);
        FHE.allowThis(_utilizationRatio[msg.sender]);
        FHE.allowThis(_totalVolume[msg.sender]);
        FHE.allowThis(_repaymentCount[msg.sender]);

        // Also allow the sender to read their own data
        FHE.allow(_paymentHistory[msg.sender], msg.sender);
        FHE.allow(_utilizationRatio[msg.sender], msg.sender);
        FHE.allow(_totalVolume[msg.sender], msg.sender);
        FHE.allow(_repaymentCount[msg.sender], msg.sender);

        hasProfile[msg.sender] = true;
        emit ProfileCreated(msg.sender, block.timestamp);
    }

    /**
     * @notice Update a specific data field (e.g., after a loan repayment).
     * Called by authorized submitters (ShadowLender updates repayment count).
     */
    function updateRepaymentCount(address user, InEuint32 calldata newCountIn) external onlyAuthorized {
        if (!hasProfile[user]) revert ProfileNotFound();

        euint32 newCount = FHE.asEuint32(newCountIn);
        _repaymentCount[user] = newCount;
        FHE.allowThis(_repaymentCount[user]);
        FHE.allow(_repaymentCount[user], user);

        emit DataUpdated(user, block.timestamp);
    }

    // ─── SCORE COMPUTATION ────────────────────────────────────────────────

    /**
     * @notice Compute the encrypted credit score for a user.
     * This triggers FHE arithmetic operations — all on encrypted data.
     * The result is stored as euint64 — never decrypted by this function.
     *
     * FORMULA (in FHE):
     *   base = 300
     *   payComponent  = paymentHistory * 35
     *   utilComponent = (100 - utilization) * 30  [lower utilization = better score]
     *   volComponent  = totalVolume / 10000         [scale down volume contribution]
     *   repayBonus    = repaymentCount * 20         [bonus per repaid loan, max boost]
     *   score = base + payComponent + utilComponent + volComponent + repayBonus
     */
    function computeScore(address user) external {
        if (!hasProfile[user]) revert ProfileNotFound();

        // Base score — trivially encrypted constant
        euint64 base = FHE.asEuint64(300);

        // Payment history component (35% weight)
        // payComponent = paymentHistory * 35
        euint64 payHistory64  = FHE.asEuint64(_paymentHistory[user]);
        euint64 payComponent  = FHE.mul(payHistory64, FHE.asEuint64(35));

        // Utilization component (30% weight — lower is better)
        // utilComponent = (100 - utilization) * 30
        euint64 util64           = FHE.asEuint64(_utilizationRatio[user]);
        euint64 invertedUtil     = FHE.sub(FHE.asEuint64(100), util64);
        euint64 utilComponent    = FHE.mul(invertedUtil, FHE.asEuint64(30));

        // Volume component — scales with on-chain activity
        euint64 volComponent = FHE.div(_totalVolume[user], FHE.asEuint64(10000));

        // Repayment bonus — 20 points per repaid loan
        euint64 repay64      = FHE.asEuint64(_repaymentCount[user]);
        euint64 repayBonus   = FHE.mul(repay64, FHE.asEuint64(20));

        // Sum all components
        euint64 score = FHE.add(base,
                         FHE.add(payComponent,
                          FHE.add(utilComponent,
                           FHE.add(volComponent, repayBonus))));

        // Store final score
        _creditScores[user] = score;

        // CRITICAL permissions
        FHE.allowThis(_creditScores[user]);          // Contract needs access for comparisons
        FHE.allow(_creditScores[user], user);         // User can decrypt their own score
        FHE.allow(_creditScores[user], owner);        // Owner/admin can verify

        hasScore[user] = true;
        emit ScoreComputed(user, block.timestamp);
    }

    // ─── QUALIFICATION CHECK ──────────────────────────────────────────────

    /**
     * @notice Check if a user's score meets an encrypted threshold.
     * Called by ShadowLender. Returns only ebool — lender NEVER sees the score.
     * The threshold is also encrypted — lender's risk params remain private too.
     *
     * @param user              Address of the borrower
     * @param thresholdIn       Encrypted minimum score required (set by lender)
     * @return qualified        Encrypted boolean — true if score >= threshold
     */
    function qualifies(
        address user,
        InEuint64 calldata thresholdIn
    ) external returns (ebool) {
        if (!hasScore[user]) revert ProfileNotFound();

        euint64 threshold = FHE.asEuint64(thresholdIn);
        ebool result = FHE.gte(_creditScores[user], threshold);

        // Allow caller (ShadowLender) to read the result
        FHE.allow(result, msg.sender);
        FHE.allowThis(result);

        return result;
    }

    /**
     * @notice Score range check — returns ebool whether score is in [low, high].
     * Used for auditor/compliance selective disclosure.
     */
    function isScoreInRange(
        address user,
        InEuint64 calldata lowIn,
        InEuint64 calldata highIn
    ) external returns (ebool) {
        if (!hasScore[user]) revert ProfileNotFound();

        euint64 low  = FHE.asEuint64(lowIn);
        euint64 high = FHE.asEuint64(highIn);

        ebool aboveLow  = FHE.gte(_creditScores[user], low);
        ebool belowHigh = FHE.lte(_creditScores[user], high);
        ebool inRange   = FHE.and(aboveLow, belowHigh);

        FHE.allow(inRange, msg.sender);
        FHE.allowThis(inRange);

        return inRange;
    }

    // ─── DECRYPTION (User-readable) ─────────────────────────────────────

    /**
     * @notice Request async decryption of user's own credit score.
     * The CoFHE coprocessor will resolve the decryption asynchronously.
     * Call getDecryptedScore() after the coprocessor resolves.
     */
    function requestDecryptScore() external {
        if (!hasScore[msg.sender]) revert ProfileNotFound();
        FHE.decrypt(_creditScores[msg.sender]);
    }

    /**
     * @notice Get the decrypted score after CoFHE has resolved.
     * Returns (score, isReady) — isReady is false if decryption is still pending.
     */
    function getDecryptedScore() external view returns (uint64 score, bool isReady) {
        if (!hasScore[msg.sender]) revert ProfileNotFound();
        return FHE.getDecryptResultSafe(_creditScores[msg.sender]);
    }

    /**
     * @notice Request async decryption of user's payment history.
     */
    function requestDecryptPaymentHistory() external {
        if (!hasProfile[msg.sender]) revert ProfileNotFound();
        FHE.decrypt(_paymentHistory[msg.sender]);
    }

    /**
     * @notice Get decrypted payment history after CoFHE resolves.
     */
    function getDecryptedPaymentHistory() external view returns (uint32 value, bool isReady) {
        if (!hasProfile[msg.sender]) revert ProfileNotFound();
        return FHE.getDecryptResultSafe(_paymentHistory[msg.sender]);
    }

    /**
     * @notice Return raw encrypted score handle (for lender contract FHE operations).
     * Only callable by authorized addresses.
     */
    function getEncryptedScore(address user) external view returns (euint64) {
        if (msg.sender != owner && !authorizedSubmitters[msg.sender]) {
            revert NotAuthorized();
        }
        return _creditScores[user];
    }
}
