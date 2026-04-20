"use client";

import { useAccount } from "wagmi";

export default function SecureFragment() {
  const { address, isConnected } = useAccount();
  const addr =
    isConnected && address
      ? `${address.slice(0, 5)}\u2026${address.slice(-4)}`
      : "0x71C\u202649A2";

  const lines = [
    ">>> INITIALIZING FHE PROTOCOL...",
    ">>> KEY_DERIVATION: SUCCESS",
    ">>> CIPHER_SUITE: ChaCha20-Poly1305",
    ">>> ENCRYPTING_METADATA_NODE_A...",
    ">>> BLIND_VERIFICATION: PENDING",
  ];
  const ready = [
    ">>> SYSTEM_READY_FOR_SUBMISSION",
    ">>> [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 100%",
  ];

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
            {addr}
          </p>
          <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">
            {isConnected ? "Hardware Ledger Linked" : "Awaiting Connection"}
          </p>
        </div>
      </div>
      <div className="w-full h-40 bg-surface-container-lowest rounded-sm p-4 font-mono text-[9px] text-secondary/50 overflow-hidden">
        {lines.map((l) => (
          <p key={l} className="mb-1">
            {l}
          </p>
        ))}
        {ready.map((l) => (
          <p key={l} className="mb-1 text-primary-fixed/40">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}
