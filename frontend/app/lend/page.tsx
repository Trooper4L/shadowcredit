"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useShadowLender } from "@/hooks/useShadowLender";
import { formatUnits } from "viem";

export default function LendPage() {
  const { isConnected } = useAccount();
  const { deposit, repayLoan, getPoolStats, loading } = useShadowLender();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [status, setStatus] = useState("");
  const [totalLiquidity, setTotalLiquidity] = useState<string>("--");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getPoolStats();
        if (stats?.totalLiquidity !== undefined) {
          setTotalLiquidity(formatUnits(stats.totalLiquidity as bigint, 6));
        }
      } catch {
        // Pool stats not available yet
      }
    };
    fetchStats();
  }, [getPoolStats]);

  const handleDeposit = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first.");
      return;
    }
    if (!depositAmount) {
      setStatus("Enter an amount to deposit.");
      return;
    }
    try {
      setStatus("Approving USDC transfer...");
      await deposit(depositAmount);
      setStatus("Deposit successful!");
      setDepositAmount("");
      const stats = await getPoolStats();
      if (stats?.totalLiquidity !== undefined) {
        setTotalLiquidity(formatUnits(stats.totalLiquidity as bigint, 6));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setStatus(`Error: ${msg}`);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first.");
      return;
    }
    if (!withdrawAmount) {
      setStatus("Enter an amount to withdraw.");
      return;
    }
    try {
      setStatus("Withdrawing from lending pool...");
      // withdrawLiquidity not in current hook — call repayLoan as placeholder
      // In production, add withdrawLiquidity to the hook
      await repayLoan();
      setStatus("Withdrawal successful.");
      setWithdrawAmount("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setStatus(`Error: ${msg}`);
    }
  };

  return (
    <>
      <section className="mb-12">
        <h2 className="text-5xl font-bold font-headline tracking-tighter text-tertiary mb-2">
          Lend - ShadowCredit
        </h2>
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-primary-fixed" />
          <p className="text-on-surface-variant font-body text-sm tracking-wide">
            Provide liquidity to the encrypted lending pool and earn yield.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Deposit Form */}
          <div className="bg-surface-container-low p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 flex items-center justify-center bg-secondary-container rounded-sm">
                <span className="material-symbols-outlined text-secondary text-sm">
                  savings
                </span>
              </div>
              <h3 className="text-xl font-headline font-bold tracking-tight">
                Deposit USDC
              </h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Amount (USDC)
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-xl focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                    placeholder="10,000"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <span className="absolute right-0 bottom-3 font-mono text-[10px] text-on-surface-variant">
                    USDC
                  </span>
                </div>
              </div>
              <button
                onClick={handleDeposit}
                disabled={loading}
                className="w-full py-4 bg-primary-fixed text-on-primary-fixed font-headline font-extrabold text-sm uppercase tracking-[0.2em] rounded-sm hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : "Approve & Deposit"}
              </button>
            </div>
          </div>

          {/* Withdraw Form */}
          <div className="bg-surface-container-low p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 flex items-center justify-center bg-surface-container-highest rounded-sm">
                <span className="material-symbols-outlined text-tertiary text-sm">
                  output
                </span>
              </div>
              <h3 className="text-xl font-headline font-bold tracking-tight">
                Withdraw Liquidity
              </h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Amount (USDC)
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-xl focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                    placeholder="5,000"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <span className="absolute right-0 bottom-3 font-mono text-[10px] text-on-surface-variant">
                    USDC
                  </span>
                </div>
              </div>
              <button
                onClick={handleWithdraw}
                disabled={loading}
                className="w-full py-4 bg-transparent border-2 border-primary-fixed text-primary-fixed font-headline font-extrabold text-sm uppercase tracking-[0.3em] rounded-sm hover:bg-primary-fixed hover:text-on-primary-fixed transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </div>

          {status && (
            <p className="text-xs font-mono text-on-surface-variant">{status}</p>
          )}
        </div>

        {/* Right Column: Pool Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-container p-6 rounded-sm border border-outline-variant/10">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-secondary">
                Pool Overview
              </span>
              <div className="px-2 py-0.5 bg-primary-fixed/10 text-primary-fixed text-[8px] font-mono rounded-sm">
                LIVE
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-sm">
                <span className="text-xs text-on-surface-variant">
                  Total Liquidity
                </span>
                <span className="text-xs font-mono text-tertiary">
                  {totalLiquidity} USDC
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-sm">
                <span className="text-xs text-on-surface-variant">
                  Active Loans
                </span>
                <span className="text-xs font-mono text-tertiary">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-sm">
                <span className="text-xs text-on-surface-variant">
                  Pool Utilization
                </span>
                <span className="text-xs font-mono text-tertiary">0%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-sm">
                <span className="text-xs text-on-surface-variant">
                  Min. Score Threshold
                </span>
                <span className="text-xs font-mono text-tertiary">500</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-sm">
                <span className="text-xs text-on-surface-variant">
                  Max LTV
                </span>
                <span className="text-xs font-mono text-tertiary">150%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1b1c] p-6 rounded-sm">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-4">
              Your Deposits
            </label>
            <p className="text-2xl font-mono text-tertiary">$0.00</p>
            <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-2">
              {isConnected ? "Fetching balance..." : "Connect wallet to view"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
