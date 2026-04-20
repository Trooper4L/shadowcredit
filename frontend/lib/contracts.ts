// Contract addresses — update these after deployment
export const CONTRACTS = {
  ShadowScorer: (process.env.NEXT_PUBLIC_SHADOW_SCORER_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  ShadowLender: (process.env.NEXT_PUBLIC_SHADOW_LENDER_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  ScoreProver: (process.env.NEXT_PUBLIC_SCORE_PROVER_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  MockUSDC: (process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  CreditPassport: (process.env.NEXT_PUBLIC_CREDIT_PASSPORT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

// Encrypted input tuple shape used by cofhe-contracts 0.1.3+:
//   struct InEuintN { uint256 ctHash; uint8 securityZone; uint8 utype; bytes signature; }
const InEuintComponents = [
  { name: "ctHash", type: "uint256" },
  { name: "securityZone", type: "uint8" },
  { name: "utype", type: "uint8" },
  { name: "signature", type: "bytes" },
] as const;

export const ShadowScorerABI = [
  {
    type: "function",
    name: "submitProfile",
    stateMutability: "nonpayable",
    inputs: [
      { name: "paymentHistoryIn", type: "tuple", components: InEuintComponents },
      { name: "utilizationIn",    type: "tuple", components: InEuintComponents },
      { name: "volumeIn",         type: "tuple", components: InEuintComponents },
      { name: "repaymentCountIn", type: "tuple", components: InEuintComponents },
    ],
    outputs: [],
  },
  { type: "function", name: "computeScore", stateMutability: "nonpayable", inputs: [{ name: "user", type: "address" }], outputs: [] },
  { type: "function", name: "hasProfile", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "hasScore", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "getScoreHandle", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  {
    type: "function",
    name: "publishScore",
    stateMutability: "nonpayable",
    inputs: [
      { name: "plaintext", type: "uint64" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
  { type: "function", name: "revealedScore", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint64" }] },
  { type: "function", name: "revealedAt", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  {
    type: "event",
    name: "ScorePublished",
    anonymous: false,
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "score", type: "uint64", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const ShadowLenderABI = [
  { type: "function", name: "deposit", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  {
    type: "function",
    name: "requestLoan",
    stateMutability: "payable",
    inputs: [
      { name: "loanAmount", type: "uint256" },
      { name: "thresholdIn", type: "tuple", components: InEuintComponents },
    ],
    outputs: [{ name: "requestId", type: "uint256" }],
  },
  {
    type: "function",
    name: "requestLoanViaPassport",
    stateMutability: "payable",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "loanAmount", type: "uint256" },
      { name: "thresholdIn", type: "tuple", components: InEuintComponents },
    ],
    outputs: [{ name: "requestId", type: "uint256" }],
  },
  { type: "function", name: "repayLoan", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "totalLiquidity", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "hasActiveLoan", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "lenderDeposits", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "activeLoans", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "amount", type: "uint256" }, { name: "collateral", type: "uint256" }, { name: "startTime", type: "uint256" }, { name: "dueTime", type: "uint256" }, { name: "repaid", type: "bool" }] },
  { type: "function", name: "withdrawLiquidity", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { type: "function", name: "passport", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
] as const;

export const ScoreProverABI = [
  { type: "function", name: "grantConsent", stateMutability: "nonpayable", inputs: [{ name: "auditor", type: "address" }], outputs: [] },
  { type: "function", name: "revokeConsent", stateMutability: "nonpayable", inputs: [{ name: "auditor", type: "address" }], outputs: [] },
  {
    type: "function",
    name: "requestRangeProof",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "lowIn",  type: "tuple", components: InEuintComponents },
      { name: "highIn", type: "tuple", components: InEuintComponents },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  { type: "function", name: "registeredAuditors", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "userConsent", stateMutability: "view", inputs: [{ name: "", type: "address" }, { name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
] as const;

export const MockUSDCABI = [
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "mint", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [] },
  { type: "function", name: "decimals", stateMutability: "pure", inputs: [], outputs: [{ name: "", type: "uint8" }] },
] as const;

export const CreditPassportABI = [
  { type: "function", name: "mint", stateMutability: "nonpayable", inputs: [], outputs: [{ name: "tokenId", type: "uint256" }] },
  { type: "function", name: "burn", stateMutability: "nonpayable", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [] },
  { type: "function", name: "passportOf", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "issuedAt", stateMutability: "view", inputs: [{ name: "", type: "uint256" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "address" }] },
  { type: "function", name: "locked", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "supportsInterface", stateMutability: "view", inputs: [{ name: "interfaceId", type: "bytes4" }], outputs: [{ name: "", type: "bool" }] },
  {
    type: "event",
    name: "PassportIssued",
    anonymous: false,
    inputs: [
      { name: "holder", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "PassportBurned",
    anonymous: false,
    inputs: [
      { name: "holder", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
  {
    type: "event",
    name: "Locked",
    anonymous: false,
    inputs: [{ name: "tokenId", type: "uint256", indexed: false }],
  },
] as const;
