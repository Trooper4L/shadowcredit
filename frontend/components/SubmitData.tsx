"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useShadowScorer } from "@/hooks/useShadowScorer";

export default function SubmitData() {
  const { isConnected } = useAccount();
  const { submitProfile, computeScore, requestDecrypt, score, loading } =
    useShadowScorer();
  const [form, setForm] = useState({
    paymentHistory: 85,
    utilization: 22,
    volume: 50000,
    repayments: 12,
  });
  const [status, setStatus] = useState("");
  const [step, setStep] = useState<
    "idle" | "submitting" | "computing" | "decrypting" | "done"
  >("idle");

  const handleSubmit = async () => {
    if (!isConnected) {
      setStatus("Please connect your wallet first.");
      return;
    }
    try {
      setStep("submitting");
      setStatus("Encrypting data locally via cofhejs & submitting to ShadowScorer...");
      await submitProfile(
        form.paymentHistory,
        form.utilization,
        form.volume,
        form.repayments
      );

      setStep("computing");
      setStatus("Computing encrypted credit score on-chain via CoFHE...");
      await computeScore();

      setStep("decrypting");
      setStatus("Requesting decryption from CoFHE coprocessor...");
      const decrypted = await requestDecrypt();

      setStep("done");
      setStatus(
        `Score decrypted: ${decrypted?.toString() ?? "N/A"}. Your encrypted profile is on-chain.`
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setStatus(`Error: ${msg}`);
      setStep("idle");
    }
  };

  return (
    <div className="bg-surface-container-low p-8 rounded-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-9xl">lock_open</span>
      </div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 flex items-center justify-center bg-secondary-container rounded-sm">
          <span className="material-symbols-outlined text-secondary text-sm">
            fingerprint
          </span>
        </div>
        <h3 className="text-xl font-headline font-bold tracking-tight">
          Build Your Encrypted Profile
        </h3>
      </div>
      <form className="space-y-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Sliders */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Payment History (Score)
                </label>
                <span className="font-mono text-primary-fixed text-sm">
                  {form.paymentHistory} / 100
                </span>
              </div>
              <input
                className="w-full h-1 bg-surface-container-highest appearance-none rounded-full accent-primary-fixed"
                max={100}
                min={0}
                type="range"
                value={form.paymentHistory}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    paymentHistory: +e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Utilization Rate (%)
                </label>
                <span className="font-mono text-primary-fixed text-sm">
                  {form.utilization}%
                </span>
              </div>
              <input
                className="w-full h-1 bg-surface-container-highest appearance-none rounded-full accent-primary-fixed"
                max={100}
                min={0}
                type="range"
                value={form.utilization}
                onChange={(e) =>
                  setForm((f) => ({ ...f, utilization: +e.target.value }))
                }
              />
            </div>
          </div>
          {/* Numeric Inputs */}
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Transaction Volume (USDC)
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-xl focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                  placeholder="50,000"
                  type="number"
                  value={form.volume}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, volume: +e.target.value }))
                  }
                />
                <span className="absolute right-0 bottom-3 font-mono text-[10px] text-on-surface-variant">
                  USDC
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Verified Repayments
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-xl focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                  placeholder="12"
                  type="number"
                  value={form.repayments}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, repayments: +e.target.value }))
                  }
                />
                <span className="absolute right-0 bottom-3 font-mono text-[10px] text-on-surface-variant">
                  TXNS
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6 flex items-center justify-between gap-8 border-t border-[#353436]/30">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <p className="text-[10px] text-on-surface-variant max-w-xs leading-relaxed">
              Your data is processed locally using{" "}
              <span className="text-secondary font-mono">cofhejs</span> and
              never leaves your browser in raw form.
            </p>
          </div>
          <button
            className="px-8 py-4 bg-primary-fixed text-on-primary-fixed font-headline font-extrabold text-sm uppercase tracking-[0.2em] rounded-sm hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center gap-3 disabled:opacity-50"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            <span className="material-symbols-outlined text-base">lock</span>
            {loading ? "Processing..." : "Encrypt & Submit"}
          </button>
        </div>
        {status && (
          <p className="text-xs font-mono text-on-surface-variant mt-2">
            {status}
          </p>
        )}
        {score !== null && step === "done" && (
          <div className="mt-4 p-4 bg-surface-container-highest rounded-sm border-l-2 border-primary-fixed">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Decrypted Credit Score
            </span>
            <p className="font-mono text-3xl text-primary-fixed mt-1">
              {score.toString()}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
