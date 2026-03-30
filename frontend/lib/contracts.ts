// Contract addresses — update these after deployment
export const CONTRACTS = {
  ShadowScorer: (process.env.NEXT_PUBLIC_SHADOW_SCORER_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  ShadowLender: (process.env.NEXT_PUBLIC_SHADOW_LENDER_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  ScoreProver: (process.env.NEXT_PUBLIC_SCORE_PROVER_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  MockUSDC: (process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

// ABIs — minimal for now, full ABIs would be imported after compile
export const ShadowScorerABI = [
  { type: "function", name: "submitProfile", stateMutability: "nonpayable", inputs: [{ name: "paymentHistoryIn", type: "tuple", components: [{ name: "data", type: "bytes" }, { name: "securityZone", type: "int32" }] }, { name: "utilizationIn", type: "tuple", components: [{ name: "data", type: "bytes" }, { name: "securityZone", type: "int32" }] }, { name: "volumeIn", type: "tuple", components: [{ name: "data", type: "bytes" }, { name: "securityZone", type: "int32" }] }, { name: "repaymentCountIn", type: "tuple", components: [{ name: "data", type: "bytes" }, { name: "securityZone", type: "int32" }] }], outputs: [] },
  { type: "function", name: "computeScore", stateMutability: "nonpayable", inputs: [{ name: "user", type: "address" }], outputs: [] },
  { type: "function", name: "hasProfile", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "hasScore", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "requestDecryptScore", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "getDecryptedScore", stateMutability: "view", inputs: [], outputs: [{ name: "score", type: "uint64" }, { name: "isReady", type: "bool" }] },
] as const;

export const ShadowLenderABI = [
  { type: "function", name: "deposit", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { type: "function", name: "requestLoan", stateMutability: "payable", inputs: [{ name: "loanAmount", type: "uint256" }, { name: "thresholdIn", type: "tuple", components: [{ name: "data", type: "bytes" }, { name: "securityZone", type: "int32" }] }], outputs: [{ name: "requestId", type: "uint256" }] },
  { type: "function", name: "repayLoan", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "totalLiquidity", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "hasActiveLoan", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "lenderDeposits", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "activeLoans", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "amount", type: "uint256" }, { name: "collateral", type: "uint256" }, { name: "startTime", type: "uint256" }, { name: "dueTime", type: "uint256" }, { name: "repaid", type: "bool" }] },
  { type: "function", name: "withdrawLiquidity", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
] as const;

export const ScoreProverABI = [
  { type: "function", name: "grantConsent", stateMutability: "nonpayable", inputs: [{ name: "auditor", type: "address" }], outputs: [] },
  { type: "function", name: "revokeConsent", stateMutability: "nonpayable", inputs: [{ name: "auditor", type: "address" }], outputs: [] },
  { type: "function", name: "requestRangeProof", stateMutability: "nonpayable", inputs: [{ name: "user", type: "address" }, { name: "lowIn", type: "tuple", components: [{ name: "data", type: "bytes" }, { name: "securityZone", type: "int32" }] }, { name: "highIn", type: "tuple", components: [{ name: "data", type: "bytes" }, { name: "securityZone", type: "int32" }] }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "registeredAuditors", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "userConsent", stateMutability: "view", inputs: [{ name: "", type: "address" }, { name: "", type: "address" }], outputs: [{ name: "", type: "bool" }] },
] as const;

export const MockUSDCABI = [
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "mint", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [] },
  { type: "function", name: "decimals", stateMutability: "pure", inputs: [], outputs: [{ name: "", type: "uint8" }] },
] as const;
