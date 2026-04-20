"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { useShadowLender } from "@/hooks/useShadowLender";
import { usePassport } from "@/hooks/usePassport";

export default function LoanRequest() {
  const { isConnected } = useAccount();
  const { requestLoan, requestLoanViaPassport, loading } = useShadowLender();
  const { tokenId, exists: hasPassport } = usePassport();

  const [loanAmount, setLoanAmount] = useState("25,000.00");
  const [collateral, setCollateral] = useState("12.50");
  const [threshold, setThreshold] = useState("500");
  const [viaPassport, setViaPassport] = useState(false);
  const [status, setStatus] = useState<string>("");

  const submit = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first.");
      return;
    }
    try {
      setStatus("Encrypting threshold and submitting loan request\u2026");
      const cleanLoan = loanAmount.replace(/[, ]/g, "");
      const cleanCollateral = collateral.replace(/[, ]/g, "");
      const collateralWei = parseEther(cleanCollateral);
      const thresholdNum = Number(threshold);
      if (viaPassport && hasPassport && tokenId) {
        await requestLoanViaPassport(tokenId, cleanLoan, collateralWei, thresholdNum);
        setStatus("Loan requested via passport. Cross-protocol handle consumed in-tx.");
      } else {
        await requestLoan(cleanLoan, collateralWei, thresholdNum);
        setStatus("Loan requested. Awaiting CoFHE qualification check.");
      }
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

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            Min Score Threshold (encrypted at submit)
          </label>
          <input
            className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-xl focus:outline-none focus:border-primary-fixed transition-all"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </div>
      </div>

      {hasPassport && (
        <label className="mt-6 flex items-center gap-3 text-[11px] text-on-surface-variant">
          <input
            type="checkbox"
            checked={viaPassport}
            onChange={(e) => setViaPassport(e.target.checked)}
            className="accent-primary-fixed"
          />
          Use my Credit Passport (tokenId {tokenId?.toString()}) — consumes the
          encrypted score handle via transient permission.
        </label>
      )}

      <div className="mt-10">
        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-5 bg-transparent border-2 border-primary-fixed text-primary-fixed font-headline font-extrabold text-sm uppercase tracking-[0.3em] rounded-sm hover:bg-primary-fixed hover:text-on-primary-fixed transition-all disabled:opacity-50"
        >
          {loading
            ? "Processing\u2026"
            : viaPassport
              ? "Request via Passport"
              : "Request Loan"}
        </button>
      </div>

      {status && (
        <p className="mt-4 font-mono text-[11px] text-on-surface-variant">
          {status}
        </p>
      )}
    </div>
  );
}
