"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useShadowLender } from "@/hooks/useShadowLender";
import { parseEther } from "viem";

export default function LoanRequest() {
  const { isConnected } = useAccount();
  const { requestLoan, loading } = useShadowLender();
  const [loanAmount, setLoanAmount] = useState("25000");
  const [collateral, setCollateral] = useState("0.01");
  const [status, setStatus] = useState("");

  const handleRequest = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first.");
      return;
    }
    try {
      setStatus("Encrypting threshold and submitting loan request...");
      const collateralWei = parseEther(collateral);
      await requestLoan(loanAmount, collateralWei);
      setStatus("Loan request submitted. Awaiting CoFHE qualification check...");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setStatus(`Error: ${msg}`);
    }
  };

  return (
    <div className="bg-surface-container-low p-8 rounded-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 flex items-center justify-center bg-surface-container-highest rounded-sm">
          <span className="material-symbols-outlined text-tertiary text-sm">
            account_balance
          </span>
        </div>
        <h3 className="text-xl font-headline font-bold tracking-tight">
          Loan Request
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            Loan Amount (USDC)
          </label>
          <div className="p-6 bg-surface-container-highest rounded-sm border-l-2 border-primary-fixed">
            <div className="flex items-end justify-between">
              <input
                className="bg-transparent border-none p-0 font-mono text-3xl focus:ring-0 focus:outline-none w-2/3 text-on-surface"
                type="text"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
              <span className="font-headline font-bold text-primary-fixed mb-1">
                USDC
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2 tracking-widest">
              EST. APR: 4.2% (ENCRYPTED RANK B)
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            Collateral (ETH)
          </label>
          <div className="p-6 bg-surface-container-highest rounded-sm border-l-2 border-secondary">
            <div className="flex items-end justify-between">
              <input
                className="bg-transparent border-none p-0 font-mono text-3xl focus:ring-0 focus:outline-none w-2/3 text-on-surface"
                type="text"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
              />
              <span className="font-headline font-bold text-secondary mb-1">
                WETH
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2 tracking-widest">
              LTV RATIO: 65.4% (SECURE)
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <button
          onClick={handleRequest}
          disabled={loading}
          className="w-full py-5 bg-transparent border-2 border-primary-fixed text-primary-fixed font-headline font-extrabold text-sm uppercase tracking-[0.3em] rounded-sm hover:bg-primary-fixed hover:text-on-primary-fixed transition-all disabled:opacity-50"
        >
          {loading ? "Processing..." : "Request Loan"}
        </button>
      </div>
      {status && (
        <p className="text-xs font-mono text-on-surface-variant mt-4">
          {status}
        </p>
      )}
    </div>
  );
}
