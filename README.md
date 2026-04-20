# Vidix

An encrypted credit passport. Other protocols read your score without reading you.

Vidix is an FHE credit primitive built on [Fhenix CoFHE](https://docs.fhenix.zone/): credit scores are computed, compared, and consumed entirely on encrypted data — no plaintext score ever exists on-chain. The user mints a soulbound passport (ERC-721 + ERC-5192); any protocol can consume their encrypted score handle under transient permission inside a single transaction.

> Vidix is powered by the ShadowScorer FHE engine. Internal contract names still carry the "Shadow" prefix to preserve deployed ABIs and addresses.

**Live on Arbitrum Sepolia** · Solidity 0.8.25 · Next.js 14 · @cofhe/sdk · wagmi

---

## How It Works

1. **Encrypt** — Borrower encrypts four numbers (payment history, utilization, volume, repayments) client-side with `@cofhe/sdk` and submits as ciphertext
2. **Score** — `ShadowScorer` computes a credit score under FHE. The score lives only as an encrypted handle
3. **Mint** — User mints a `CreditPassport` (soulbound, one per wallet) tied to that encrypted handle
4. **Consume** — Any protocol — lender, DAO, insurance pool — calls `CreditPassport.readEncryptedScore(tokenId, consumer)`, receives the handle under `FHE.allowTransient`, and compares against its own threshold in the same tx
5. **Reveal (optional)** — The user can decrypt their own score off-chain via `decryptForView` (no gas), or publish to chain via `decryptForTx` → `FHE.publishDecryptResult`

---

## Architecture

```
┌──────────────┐  @cofhe/sdk encrypt   ┌────────────────┐
│   Browser    │ ────────────────────→ │  ShadowScorer  │
│   (Next.js)  │                       │  FHE scoring   │
└──────────────┘                       └───────┬────────┘
                                               │ encrypted handle
                                               ▼
                                       ┌────────────────┐
                                       │ CreditPassport │ ← soulbound ERC-5192
                                       │   (primitive)  │
                                       └───────┬────────┘
                                               │ FHE.allowTransient
                                    ┌──────────┼──────────┐
                                    ▼          ▼          ▼
                          ┌────────────┐ ┌─────────┐ ┌────────────┐
                          │ShadowLender│ │ DAO gate │ │ insurance  │
                          └────────────┘ └─────────┘ └────────────┘
```

---

## Smart Contracts

### CreditPassport (the primitive)

Soulbound ERC-721 + ERC-5192. Issued one-per-wallet, bound to the user's encrypted credit profile.

**Key functions:**
- `mint()` — requires an encrypted profile on `ShadowScorer`
- `burn(tokenId)` — enables lost-key recovery via remint
- `readEncryptedScore(tokenId, consumer)` — grants the consumer a transient FHE permission on the holder's score handle for the current tx, then returns the handle
- `locked(tokenId) → true`, `supportsInterface(0xb45a3c0e) → true`
- Transfers revert in `_update` override

### ShadowScorer

FHE credit engine. Stores financial inputs as `euint32`/`euint64` and computes scores entirely under FHE.

**Scoring formula** (all operations on ciphertext):
```
score = 300
      + (paymentHistory × 35)
      + ((100 − utilization) × 30)
      + (volume ÷ 10000)
      + (repaymentCount × 20)
```

**Key functions:**
- `submitProfile(InEuint32, InEuint32, InEuint64, InEuint32)` — accept encrypted inputs
- `computeScore()` — run FHE arithmetic, produce encrypted score handle
- `getScoreHandle()` — `euint64` handle for permit-gated off-chain decrypt
- `publishScore(uint64 plaintext, bytes signature)` — verifies threshold signature via `FHE.publishDecryptResult`, stores `revealedScore[msg.sender]`, emits `ScorePublished`

### ShadowLender

Undercollateralized lending pool consuming encrypted score handles.

**Key functions:**
- `requestLoan(amount, InEuint64 threshold)` — direct path
- `requestLoanViaPassport(tokenId, amount, InEuint64 threshold)` — consumes the score handle via `CreditPassport.readEncryptedScore`; demonstrates cross-protocol consumption
- `settleLoan()`, `repayLoan()`, `deposit()`, `withdrawLiquidity()`

### ScoreProver

Selective disclosure. Auditors ask "is score in [low, high]?" under FHE and receive only a boolean handle.

### MockUSDC

ERC-20 test token with 6 decimals and a public `mint()` faucet.

---

## FHE Operations Used

| Operation | Solidity | Purpose |
|-----------|----------|---------|
| Addition | `FHE.add()` | Score component accumulation |
| Subtraction | `FHE.sub()` | Utilization inversion (100 − util) |
| Multiplication | `FHE.mul()` | Weight application |
| Division | `FHE.div()` | Volume scaling |
| Comparison | `FHE.gte()`, `FHE.lte()` | Qualification and range checks |
| Logic | `FHE.and()` | Combining range bounds |
| Permissions | `FHE.allowThis()`, `FHE.allow()`, `FHE.allowTransient()` | Persistent + tx-scoped permissions |
| Publish | `FHE.publishDecryptResult()` | On-chain verification of threshold-signed plaintext |

---

## Frontend

Next.js 14 (App Router), Tailwind, wagmi v3, viem. Design system: **Ledger** — warm off-white paper (#F7F3EC), ink (#1B1A17), oxblood (#6E1F1F) accents, Fraunces serif. Editorial broadsheet, not crypto dashboard.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Ledger — summary cards, passport CTA, recent activity |
| `/borrow` | Submit encrypted profile, compute score, request loans (with or without passport) |
| `/lend` | Deposit/withdraw pool liquidity |
| `/auditor` | Grant/revoke consent, request encrypted range proofs |
| `/passport` | Mint/burn soulbound credit passport |

### Hooks

- **`useShadowScorer`** — `submitProfile`, `computeScore`
- **`useDecryptScoreForDisplay`** — off-chain `decryptForView` (permit-gated, no gas)
- **`useDecryptScoreForChain`** — `decryptForTx` → `publishScore` tx
- **`useShadowLender`** — pool flows + `requestLoanViaPassport`
- **`useScoreProver`** — consent + encrypted range proofs
- **`usePassport`** — mint/burn, reads `passportOf(address)`

### CoFHE

Browser encryption runs through `@cofhe/sdk@0.4.x` (`createCofheClient`, `Encryptable.uint32/uint64`, `client.encryptInputs().execute()`). Decryption has two paths:

- `decryptForView(ctHash, FheTypes.Uint64)` — off-chain, permit-gated, no gas
- `decryptForTx(ctHash)` — returns `{ decryptedValue, signature }` for `FHE.publishDecryptResult`

The `CofheProvider` React context connects the client to the user's `publicClient` + `walletClient` on wallet connect. Permits are created lazily via `client.permits.getOrCreateSelfPermit()` and cached in `sessionStorage`.

---

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm
- MetaMask on Arbitrum Sepolia
- Arbitrum Sepolia ETH for gas

### Install

```bash
git clone https://github.com/Trooper4L/shadowcredit.git
cd shadowcredit
pnpm install
```

### Configure

```bash
cp .env.example .env
```

Set `PRIVATE_KEY` and `ARB_SEPOLIA_RPC`.

### Compile + Test

```bash
pnpm compile
pnpm test
```

### Deploy to Arbitrum Sepolia

```bash
pnpm deploy:testnet
```

Deploys all five contracts (MockUSDC, ShadowScorer, ShadowLender, ScoreProver, CreditPassport), authorizes dependencies, seeds the pool with 10,000 mUSDC, writes `deployments.json`.

### Run Frontend

```bash
cd frontend
cp .env.local.example .env.local
pnpm install
pnpm dev
```

---

## CLI Tasks

| Command | Description |
|---------|-------------|
| `npx hardhat deploy-all --network arb-sepolia` | Deploy all contracts |
| `npx hardhat submit-profile --network arb-sepolia` | Submit encrypted credit profile |
| `npx hardhat decrypt-score --network arb-sepolia` | Off-chain score decrypt via `decryptForView` |
| `npx hardhat publish-score --network arb-sepolia` | Publish decrypted score on-chain via `publishDecryptResult` |

---

## Project Structure

```
shadowcredit/
├── contracts/
│   ├── MockUSDC.sol          # Test USDC token
│   ├── ShadowScorer.sol      # FHE credit scoring engine
│   ├── ShadowLender.sol      # Lending pool (direct + via-passport)
│   ├── ScoreProver.sol       # Auditor range proofs
│   └── CreditPassport.sol    # Soulbound ERC-721 + ERC-5192 primitive
├── tasks/
│   ├── deploy-all.ts
│   ├── submit-profile.ts
│   └── decrypt-score.ts      # includes publish-score task
├── test/
├── frontend/
│   ├── app/                  # dashboard, borrow, lend, auditor, passport
│   ├── components/           # TopNav, CofheProvider, SubmitData, LoanRequest, …
│   ├── hooks/                # useShadowScorer, usePassport, …
│   └── lib/                  # cofhe client, contracts config, wagmi setup
├── hardhat.config.ts
├── deployments.json
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| FHE | Fhenix CoFHE (cofhe-contracts 0.1.3, @cofhe/sdk 0.4.x) |
| Contracts | Solidity 0.8.25, Hardhat, OpenZeppelin v5 |
| Network | Arbitrum Sepolia (Chain ID: 421614) |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Web3 | wagmi, viem |
| Testing | Hardhat + Chai + cofhe-hardhat-plugin (FHE mocks) |

---

## License

MIT
