"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScoreProver } from "@/hooks/useScoreProver";

export default function AuditorPage() {
  const { isConnected } = useAccount();
  const { grantConsent, revokeConsent, requestRangeProof, loading } =
    useScoreProver();
  const [auditorAddress, setAuditorAddress] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [lowBound, setLowBound] = useState("");
  const [highBound, setHighBound] = useState("");
  const [status, setStatus] = useState("");
  const [proofResult, setProofResult] = useState<string | null>(null);

  const handleGrantConsent = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first.");
      return;
    }
    if (!auditorAddress) {
      setStatus("Enter an auditor address.");
      return;
    }
    try {
      setStatus("Granting consent to auditor...");
      await grantConsent(auditorAddress as `0x${string}`);
      setStatus("Consent granted successfully.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setStatus(`Error: ${msg}`);
    }
  };

  const handleRevokeConsent = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first.");
      return;
    }
    if (!auditorAddress) {
      setStatus("Enter an auditor address.");
      return;
    }
    try {
      setStatus("Revoking consent...");
      await revokeConsent(auditorAddress as `0x${string}`);
      setStatus("Consent revoked.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setStatus(`Error: ${msg}`);
    }
  };

  const handleRangeProof = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first.");
      return;
    }
    if (!userAddress || !lowBound || !highBound) {
      setStatus("Fill in all fields for the range proof request.");
      return;
    }
    try {
      setStatus("Encrypting bounds and requesting range proof...");
      setProofResult(null);
      await requestRangeProof(
        userAddress as `0x${string}`,
        Number(lowBound),
        Number(highBound)
      );
      setProofResult("SUBMITTED — Awaiting CoFHE resolution...");
      setStatus("Range proof submitted. Check back for the result.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setStatus(`Error: ${msg}`);
      setProofResult(null);
    }
  };

  return (
    <>
      <section className="mb-12">
        <h2 className="text-5xl font-bold font-headline tracking-tighter text-tertiary mb-2">
          Auditor - ShadowCredit
        </h2>
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-primary-fixed" />
          <p className="text-on-surface-variant font-body text-sm tracking-wide">
            Selective disclosure and compliance verification via encrypted range
            proofs.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* User Consent Management */}
          <div className="bg-surface-container-low p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 flex items-center justify-center bg-secondary-container rounded-sm">
                <span className="material-symbols-outlined text-secondary text-sm">
                  handshake
                </span>
              </div>
              <h3 className="text-xl font-headline font-bold tracking-tight">
                Consent Management
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Grant or revoke an auditor&apos;s permission to verify your score
              range. They will only learn if your score falls within their query
              range — never the actual value.
            </p>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Auditor Address
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-sm focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                    placeholder="0x..."
                    value={auditorAddress}
                    onChange={(e) => setAuditorAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleGrantConsent}
                  disabled={loading}
                  className="flex-1 py-3 bg-primary-fixed text-on-primary-fixed font-headline font-bold text-xs uppercase tracking-[0.2em] rounded-sm hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Grant Consent"}
                </button>
                <button
                  onClick={handleRevokeConsent}
                  disabled={loading}
                  className="flex-1 py-3 bg-transparent border-2 border-error/50 text-error font-headline font-bold text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-error/10 transition-all disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Revoke Consent"}
                </button>
              </div>
            </div>
          </div>

          {/* Range Proof Request (Auditor View) */}
          <div className="bg-surface-container-low p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 flex items-center justify-center bg-surface-container-highest rounded-sm">
                <span className="material-symbols-outlined text-tertiary text-sm">
                  verified
                </span>
              </div>
              <h3 className="text-xl font-headline font-bold tracking-tight">
                Request Range Proof
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              As a registered auditor, verify whether a user&apos;s encrypted
              credit score falls within a specified range. You will receive only
              a boolean result (true/false).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  User Address
                </label>
                <input
                  className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-sm focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                  placeholder="0x..."
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Low Bound
                </label>
                <input
                  className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-sm focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                  placeholder="500"
                  type="number"
                  value={lowBound}
                  onChange={(e) => setLowBound(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  High Bound
                </label>
                <input
                  className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-sm focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                  placeholder="800"
                  type="number"
                  value={highBound}
                  onChange={(e) => setHighBound(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleRangeProof}
              disabled={loading}
              className="w-full py-4 bg-transparent border-2 border-secondary text-secondary font-headline font-extrabold text-sm uppercase tracking-[0.3em] rounded-sm hover:bg-secondary/10 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Submit Range Proof Request"}
            </button>

            {proofResult && (
              <div className="mt-6 p-4 bg-surface-container-highest rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                  Proof Result
                </p>
                <p className="font-mono text-lg text-secondary">{proofResult}</p>
              </div>
            )}
          </div>

          {status && (
            <p className="text-xs font-mono text-on-surface-variant">{status}</p>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-container p-6 rounded-sm border border-outline-variant/10">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-secondary">
                Auditor Info
              </span>
              <div className="px-2 py-0.5 bg-secondary/10 text-secondary text-[8px] font-mono rounded-sm">
                COMPLIANCE
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-sm">
                <span className="text-xs text-on-surface-variant">Protocol</span>
                <span className="text-xs font-mono text-tertiary">
                  ScoreProver
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-sm">
                <span className="text-xs text-on-surface-variant">
                  Disclosure Type
                </span>
                <span className="text-xs font-mono text-tertiary">
                  Range Proof
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-sm">
                <span className="text-xs text-on-surface-variant">
                  Output Type
                </span>
                <span className="text-xs font-mono text-tertiary">ebool</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1b1c] p-6 rounded-sm">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-4">
              How It Works
            </label>
            <div className="space-y-3 font-mono text-[9px] text-secondary/50">
              <p>&gt;&gt;&gt; USER grants consent to AUDITOR</p>
              <p>&gt;&gt;&gt; AUDITOR encrypts range bounds [low, high]</p>
              <p>&gt;&gt;&gt; ScoreProver checks: low &lt;= score &lt;= high</p>
              <p>&gt;&gt;&gt; Returns: ebool (true/false)</p>
              <p className="text-primary-fixed/40">
                &gt;&gt;&gt; SCORE NEVER REVEALED
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
