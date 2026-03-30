"use client";

import { useAccount } from "wagmi";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <section className="mb-12">
        <h2 className="text-5xl font-bold font-headline tracking-tighter text-tertiary mb-2">
          Dashboard
        </h2>
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-primary-fixed" />
          <p className="text-on-surface-variant font-body text-sm tracking-wide">
            Your encrypted credit overview and protocol metrics.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        {/* Portfolio Stats */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-6 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">
                Credit Score Status
              </p>
              <p className="text-3xl font-headline font-bold text-primary-fixed">
                {isConnected ? "ENCRYPTED" : "---"}
              </p>
              <p className="text-[10px] text-on-surface-variant mt-2 tracking-widest">
                FHE-PROTECTED ON-CHAIN
              </p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">
                Active Loans
              </p>
              <p className="text-3xl font-headline font-bold text-tertiary">0</p>
              <p className="text-[10px] text-on-surface-variant mt-2 tracking-widest">
                NO OUTSTANDING DEBT
              </p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">
                Pool Deposits
              </p>
              <p className="text-3xl font-headline font-bold text-tertiary">
                $0.00
              </p>
              <p className="text-[10px] text-on-surface-variant mt-2 tracking-widest">
                TOTAL DEPOSITED USDC
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface-container-low p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 flex items-center justify-center bg-surface-container-highest rounded-sm">
                <span className="material-symbols-outlined text-tertiary text-sm">
                  history
                </span>
              </div>
              <h3 className="text-xl font-headline font-bold tracking-tight">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-0">
              {[
                { action: "Protocol Deployed", time: "Genesis Block", status: "CONFIRMED" },
                { action: "Lending Pool Seeded", time: "10,000 mUSDC", status: "ACTIVE" },
                { action: "CoFHE Coprocessor", time: "Connected", status: "ONLINE" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-4 ${
                    i % 2 === 0 ? "bg-surface-container-low" : ""
                  } rounded-sm`}
                >
                  <div>
                    <p className="text-sm text-on-surface">{item.action}</p>
                    <p className="text-[10px] text-on-surface-variant tracking-widest">
                      {item.time}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-primary-fixed tracking-widest">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-container p-6 rounded-sm border border-outline-variant/10">
            <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-secondary block mb-6">
              Protocol Stats
            </span>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-sm">
                <span className="text-xs text-on-surface-variant">Network</span>
                <span className="text-xs font-mono text-tertiary">
                  Arbitrum Sepolia
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-sm">
                <span className="text-xs text-on-surface-variant">Chain ID</span>
                <span className="text-xs font-mono text-tertiary">421614</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-sm">
                <span className="text-xs text-on-surface-variant">FHE Engine</span>
                <span className="text-xs font-mono text-tertiary">CoFHE v0.3</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-sm">
                <span className="text-xs text-on-surface-variant">
                  Min. Score
                </span>
                <span className="text-xs font-mono text-tertiary">500</span>
              </div>
            </div>
          </div>

          {/* Wallet Status */}
          <div className="bg-[#1c1b1c] p-6 rounded-sm">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-4">
              Wallet Status
            </label>
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-primary-fixed animate-pulse" : "bg-error"
                }`}
              />
              <span className="text-sm font-mono text-on-surface-variant">
                {isConnected
                  ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : "Not Connected"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
