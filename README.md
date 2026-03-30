# ShadowCredit

Encrypted on-chain credit scoring and undercollateralized lending protocol built on [Fhenix CoFHE](https://docs.fhenix.zone/) (Fully Homomorphic Encryption). Credit scores are computed entirely on encrypted data — no plaintext scores ever exist on-chain.

**Live on Arbitrum Sepolia** | Solidity 0.8.25 | Next.js 14 | cofhejs | wagmi

---

## How It Works

1. **Encrypt** — Borrower encrypts financial data (payment history, utilization, volume, repayments) client-side using `cofhejs` before submitting to the blockchain
2. **Score** — `ShadowScorer` computes a credit score using FHE arithmetic on encrypted values. The score never exists in plaintext on-chain
3. **Qualify** — `ShadowLender` checks if the encrypted score meets a threshold, receiving only a boolean (pass/fail) — never the actual score
4. **Prove** — `ScoreProver` lets auditors verify if a score falls within a range via encrypted range proofs, returning only true/false

---

## Architecture

```
┌──────────────┐     cofhejs encrypt     ┌────────────────┐
│   Browser    │ ──────────────────────→  │  ShadowScorer  │
│   (Next.js)  │                         │  FHE scoring   │
└──────────────┘                         └───────┬────────┘
                                                 │ qualifies() → ebool
                                                 ▼
                                         ┌────────────────┐
                                         │  ShadowLender  │
                                         │  Lending pool  │
                                         └────────────────┘
                                                 │
                                                 ▼
                                         ┌────────────────┐
                                         │  ScoreProver   │
                                         │  Range proofs  │
                                         └────────────────┘
```

---

## Smart Contracts

### ShadowScorer

Core FHE credit scoring engine. Stores all financial data as encrypted types (`euint32`, `euint64`) and computes scores using FHE arithmetic.

**Scoring formula** (all operations on encrypted values):
```
score = 300
      + (paymentHistory × 35)
      + ((100 − utilization) × 30)
      + (volume ÷ 10000)
      + (repaymentCount × 20)
```

Score range: ~300 (worst) to ~850+ (best).

**Key functions:**
- `submitProfile()` — Accept encrypted financial inputs
- `computeScore()` — Run FHE arithmetic to produce encrypted score
- `qualifies()` — Returns `ebool`: does score >= encrypted threshold?
- `isScoreInRange()` — Returns `ebool`: is score within [low, high]?
- `requestDecryptScore()` / `getDecryptedScore()` — Async decryption via CoFHE (user can only decrypt their own score)

### ShadowLender

Undercollateralized lending pool. Borrowers can request loans up to 150% of their collateral value if their encrypted credit score qualifies.

**Key functions:**
- `deposit()` / `withdrawLiquidity()` — Lender liquidity management
- `requestLoan()` — Borrower submits loan request with encrypted threshold
- `settleLoan()` — Owner settles after CoFHE resolves the qualification check
- `repayLoan()` — Borrower repays and reclaims collateral

### ScoreProver

Selective disclosure for compliance. Auditors can verify score ranges without learning the actual score.

**Key functions:**
- `registerAuditor()` — Owner whitelists auditor addresses
- `grantConsent()` / `revokeConsent()` — Users control who can query their score
- `requestRangeProof()` — Auditor asks "is score in [low, high]?" and receives only `ebool`

### MockUSDC

ERC20 test token with 6 decimals and a public `mint()` faucet.

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
| Permissions | `FHE.allowThis()`, `FHE.allow()` | Access control on encrypted values |
| Decryption | `FHE.decrypt()`, `FHE.getDecryptResultSafe()` | Async score reveal to user |

---

## Frontend

Built with Next.js 14 (App Router), Tailwind CSS, wagmi, and viem. Design system: **Obsidian Ledger** — dark theme (#131314), Cyber Lime (#CCFF00) accents, glassmorphism, sharp 2px corners.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — portfolio stats, recent activity, protocol info |
| `/borrow` | Submit encrypted profile, compute score, request loans |
| `/lend` | Deposit/withdraw USDC, view pool statistics |
| `/auditor` | Grant/revoke consent, request encrypted range proofs |

### Hooks

- **`useShadowScorer`** — `submitProfile()`, `computeScore()`, `requestDecrypt()` with polling
- **`useShadowLender`** — `deposit()` (approve + deposit flow), `requestLoan()`, `repayLoan()`, `getPoolStats()`
- **`useScoreProver`** — `grantConsent()`, `revokeConsent()`, `requestRangeProof()`

---

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm
- MetaMask (configured for Arbitrum Sepolia)
- Arbitrum Sepolia ETH for gas ([bridge from Sepolia](https://bridge.arbitrum.io/))

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

Edit `.env` with your private key and RPC URL:

```
PRIVATE_KEY=your_private_key_here
ARB_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
```

### Compile Contracts

```bash
pnpm compile
```

### Run Tests

```bash
pnpm test
```

Tests run against the Hardhat network with CoFHE mocks. Covers:
- Profile submission and encrypted score computation
- Qualification pass/fail scenarios
- Deposit, loan request, settlement, and repayment flows
- Auditor consent and range proof verification

### Deploy to Arbitrum Sepolia

```bash
pnpm deploy:testnet
```

This deploys all 4 contracts, authorizes ShadowLender in ShadowScorer, seeds the pool with 10,000 mUSDC, and writes addresses to `deployments.json`.

### Run Frontend

```bash
cd frontend
cp .env.local.example .env.local  # or create with deployed addresses
pnpm install
pnpm dev
```

Set these in `frontend/.env.local`:

```
NEXT_PUBLIC_SHADOW_SCORER_ADDRESS=0x...
NEXT_PUBLIC_SHADOW_LENDER_ADDRESS=0x...
NEXT_PUBLIC_SCORE_PROVER_ADDRESS=0x...
NEXT_PUBLIC_MOCK_USDC_ADDRESS=0x...
```

Open [http://localhost:3000](http://localhost:3000) and connect MetaMask on Arbitrum Sepolia.

---

## CLI Tasks

| Command | Description |
|---------|-------------|
| `npx hardhat deploy-shadowcredit --network arb-sepolia` | Deploy all contracts |
| `npx hardhat submit-profile --network arb-sepolia` | Submit encrypted credit profile |
| `npx hardhat decrypt-score --network arb-sepolia` | Decrypt your credit score |

---

## Deployed Contracts (Arbitrum Sepolia)

| Contract | Address |
|----------|---------|
| MockUSDC | `0x7F2cf8FeABC1Cc7f2eA42371Bd912D587107E69d` |
| ShadowScorer | `0x22Ccc0840cD7d96D380E06bdd7fF8AF123E1e167` |
| ShadowLender | `0x5Ac1Ee1129B93FFfC0d2C87F7e77032988234148` |
| ScoreProver | `0xbaC5330762e788D06fb4711aabe704B9E6fCf792` |

---

## Project Structure

```
shadowcredit/
├── contracts/
│   ├── MockUSDC.sol          # Test USDC token (6 decimals, public mint)
│   ├── ShadowScorer.sol      # FHE credit scoring engine
│   ├── ShadowLender.sol      # Undercollateralized lending pool
│   └── ScoreProver.sol       # Auditor selective disclosure
├── tasks/
│   ├── deploy-all.ts         # Full deployment + setup
│   ├── submit-profile.ts     # CLI profile submission
│   ├── decrypt-score.ts      # CLI score decryption
│   └── index.ts
├── test/
│   ├── ShadowScorer.test.ts  # Scoring + qualification tests
│   ├── ShadowLender.test.ts  # Lending flow tests
│   └── ScoreProver.test.ts   # Range proof + consent tests
├── frontend/
│   ├── app/                  # Next.js pages (dashboard, borrow, lend, auditor)
│   ├── components/           # UI components (TopNav, Sidebar, SubmitData, etc.)
│   ├── hooks/                # Contract interaction hooks
│   └── lib/                  # wagmi config, contract ABIs + addresses
├── hardhat.config.ts
├── deployments.json          # Deployed contract addresses
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| FHE | Fhenix CoFHE (cofhe-contracts v0.0.13, cofhejs v0.3.1) |
| Contracts | Solidity 0.8.25, Hardhat, OpenZeppelin |
| Network | Arbitrum Sepolia (Chain ID: 421614) |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Web3 | wagmi, viem |
| Testing | Hardhat + Chai + cofhe-hardhat-plugin (FHE mocks) |

---

## License

MIT
