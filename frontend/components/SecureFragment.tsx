"use client";

import { useAccount } from "wagmi";

export default function SecureFragment() {
  const { address, isConnected } = useAccount();

  const truncatedAddr = isConnected && address
    ? `${address.slice(0, 5)}...${address.slice(-4)}`
    : "0x71C...49A2";

  return (
    <div className="bg-[#1c1b1c] p-6 rounded-sm relative overflow-hidden group">
      <div className="secure-fragment-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-4">
        Vault Identity
      </label>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-surface-container-highest rounded-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-primary-fixed">
            encrypted
          </span>
        </div>
        <div>
          <p className="font-mono text-sm text-tertiary tracking-tighter">
            {truncatedAddr}
          </p>
          <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">
            {isConnected ? "Wallet Connected" : "Hardware Ledger Linked"}
          </p>
        </div>
      </div>
      <div className="w-full h-40 bg-surface-container-lowest rounded-sm p-4 font-mono text-[9px] text-secondary/50 overflow-hidden">
        <p className="mb-1">&gt;&gt;&gt; INITIALIZING FHE PROTOCOL...</p>
        <p className="mb-1">&gt;&gt;&gt; KEY_DERIVATION: SUCCESS</p>
        <p className="mb-1">&gt;&gt;&gt; CIPHER_SUITE: ChaCha20-Poly1305</p>
        <p className="mb-1">&gt;&gt;&gt; ENCRYPTING_METADATA_NODE_A...</p>
        <p className="mb-1">&gt;&gt;&gt; BLIND_VERIFICATION: PENDING</p>
        <p className="mb-1 text-primary-fixed/40">
          &gt;&gt;&gt; SYSTEM_READY_FOR_SUBMISSION
        </p>
        <p className="mb-1 text-primary-fixed/40">
          &gt;&gt;&gt; [████████████████] 100%
        </p>
      </div>
    </div>
  );
}
