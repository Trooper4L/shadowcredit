// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";
import "./ShadowScorer.sol";

/**
 * @title ScoreProver
 * @notice Enables selective disclosure of encrypted credit scores to auditors.
 * Auditors can verify that a user's score falls within a declared range
 * WITHOUT ever seeing the actual score. Pure ebool output.
 *
 * Example use case:
 *   Regulator asks: "Can you prove User X has a score above 600?"
 *   ScoreProver returns: ebool (true/false) — regulator gets proof, not data.
 */
contract ScoreProver {

    ShadowScorer public immutable scorer;
    address public owner;

    /// @notice Registered auditor addresses
    mapping(address => bool) public registeredAuditors;

    /// @notice User consent — user must approve an auditor to check their score
    mapping(address => mapping(address => bool)) public userConsent;
    // userConsent[user][auditor] = true if user has consented

    event AuditorRegistered(address indexed auditor);
    event ConsentGranted(address indexed user, address indexed auditor);
    event ConsentRevoked(address indexed user, address indexed auditor);
    event RangeProofRequested(address indexed auditor, address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuditor() {
        require(registeredAuditors[msg.sender], "Not a registered auditor");
        _;
    }

    constructor(address _scorer) {
        scorer = ShadowScorer(_scorer);
        owner = msg.sender;
    }

    function registerAuditor(address auditor) external onlyOwner {
        registeredAuditors[auditor] = true;
        emit AuditorRegistered(auditor);
    }

    /**
     * @notice User grants an auditor permission to check their score range.
     * This does NOT reveal the score — only allows range comparisons.
     */
    function grantConsent(address auditor) external {
        require(registeredAuditors[auditor], "Not a registered auditor");
        userConsent[msg.sender][auditor] = true;
        emit ConsentGranted(msg.sender, auditor);
    }

    function revokeConsent(address auditor) external {
        userConsent[msg.sender][auditor] = false;
        emit ConsentRevoked(msg.sender, auditor);
    }

    /**
     * @notice Auditor requests a range proof for a user's score.
     * Returns ebool — true if score is within [lowIn, highIn], false otherwise.
     * The auditor learns ONLY whether the score is in range. Nothing more.
     *
     * @param user      The user whose score range is being verified
     * @param lowIn     Encrypted lower bound of the range
     * @param highIn    Encrypted upper bound of the range
     */
    function requestRangeProof(
        address user,
        InEuint64 calldata lowIn,
        InEuint64 calldata highIn
    ) external onlyAuditor returns (ebool) {
        require(userConsent[user][msg.sender], "User has not consented");
        require(scorer.hasScore(user), "User has no credit score");

        emit RangeProofRequested(msg.sender, user);

        // Delegate to ShadowScorer's range check — pure FHE comparison
        ebool inRange = scorer.isScoreInRange(user, lowIn, highIn);

        // Allow the auditor to read the result
        FHE.allow(inRange, msg.sender);

        return inRange;
    }
}
