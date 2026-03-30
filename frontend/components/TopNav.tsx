"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function TopNav() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const injected = connectors.find((c) => c.id === "injected");
    if (injected) connect({ connector: injected });
  };

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header className="fixed top-0 right-0 left-64 h-16 flex items-center justify-between px-8 z-40 bg-[#131314]/60 backdrop-blur-xl border-b border-[#353436]/30">
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-outlined text-secondary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          shield
        </span>
        <span className="font-headline text-sm uppercase tracking-widest text-[#c4c9ac]">
          Secured Terminal
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary-fixed transition-colors">
            notifications
          </span>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary-fixed transition-colors">
            shield
          </span>
        </div>
        <button className="px-4 py-1.5 border border-outline-variant text-[10px] uppercase tracking-widest hover:border-secondary transition-colors text-secondary">
          Arbitrum Sepolia
        </button>
        {isConnected ? (
          <button
            onClick={() => disconnect()}
            className="px-6 py-1.5 bg-primary-fixed text-on-primary-fixed font-headline font-bold text-xs uppercase tracking-widest rounded-sm hover:opacity-90 active:opacity-70 transition-all"
          >
            {truncateAddress(address!)}
          </button>
        ) : (
          <button
            onClick={handleConnect}
            className="px-6 py-1.5 bg-primary-fixed text-on-primary-fixed font-headline font-bold text-xs uppercase tracking-widest rounded-sm hover:opacity-90 active:opacity-70 transition-all"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
