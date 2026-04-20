// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ShadowScorer.sol";

interface IERC5192 {
    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);
    function locked(uint256 tokenId) external view returns (bool);
}

/**
 * @title CreditPassport
 * @notice Soulbound ERC-721 representing a user's FHE credit identity.
 *
 * The passport is the public handle; the score it points to stays encrypted.
 * Any external protocol can call `readEncryptedScore(tokenId, consumer)` to
 * receive a usable euint64 handle scoped (via allowTransient) to the current tx.
 *
 * This turns Vidix from "another FHE lender" into a credit primitive that
 * other protocols integrate with.
 */
contract CreditPassport is ERC721, IERC5192 {
    ShadowScorer public immutable scorer;

    uint256 public nextTokenId = 1;
    mapping(address => uint256) public passportOf;
    mapping(uint256 => uint256) public issuedAt;

    event PassportIssued(address indexed holder, uint256 indexed tokenId, uint256 timestamp);
    event PassportBurned(address indexed holder, uint256 indexed tokenId);

    error SoulboundTransferDisallowed();
    error AlreadyMinted();
    error NoProfile();
    error NotHolder();
    error UnknownPassport();

    constructor(address _scorer) ERC721("Vidix Credit Passport", "VIDIX") {
        scorer = ShadowScorer(_scorer);
    }

    // ─── MINT / BURN ──────────────────────────────────────────────────────

    function mint() external returns (uint256 tokenId) {
        if (passportOf[msg.sender] != 0) revert AlreadyMinted();
        if (!scorer.hasProfile(msg.sender)) revert NoProfile();

        tokenId = nextTokenId++;
        passportOf[msg.sender] = tokenId;
        issuedAt[tokenId] = block.timestamp;

        _safeMint(msg.sender, tokenId);
        emit PassportIssued(msg.sender, tokenId, block.timestamp);
        emit Locked(tokenId);
    }

    function burn(uint256 tokenId) external {
        if (ownerOf(tokenId) != msg.sender) revert NotHolder();
        delete passportOf[msg.sender];
        delete issuedAt[tokenId];
        _burn(tokenId);
        emit PassportBurned(msg.sender, tokenId);
    }

    // ─── SOULBOUND ────────────────────────────────────────────────────────

    function locked(uint256 tokenId) external view returns (bool) {
        ownerOf(tokenId); // reverts if nonexistent
        return true;
    }

    /// @dev OZ v5 — _update is the single chokepoint for mint/transfer/burn.
    /// Allow zero-address sides (mint from 0, burn to 0); block everything else.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert SoulboundTransferDisallowed();
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IERC5192).interfaceId || super.supportsInterface(interfaceId);
    }

    // ─── INTEGRATION PRIMITIVE ────────────────────────────────────────────

    /**
     * @notice Lend the passport holder's encrypted score handle to `consumer`
     * for the duration of the current transaction. The consumer can then call
     * FHE arithmetic against the handle (e.g. gte vs. an encrypted threshold)
     * but cannot store it or decrypt the plaintext without the holder's permit.
     *
     * @dev CreditPassport must be an authorized submitter on ShadowScorer
     * so that `getEncryptedScore` returns the handle.
     */
    function readEncryptedScore(uint256 tokenId, address consumer) external returns (euint64 handle) {
        address holder = _ownerOf(tokenId);
        if (holder == address(0)) revert UnknownPassport();

        handle = scorer.getEncryptedScore(holder);
        FHE.allowTransient(handle, consumer);
    }

    function getPassportOf(address user) external view returns (uint256) {
        return passportOf[user];
    }
}
