"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { useScoreProver } from "@/hooks/useScoreProver";

type StatusTone = "info" | "ok" | "err";

type Verdict = "True" | "False" | "Pending";

const LEDGER: {
  subject: string;
  bounds: string;
  tag: string;
  verdict: Verdict;
  tx: string;
}[] = [
  { subject: "No. 00421", bounds: "[600, 700]", tag: "EU-MICA",  verdict: "True",    tx: "0x8a7b…1e04" },
  { subject: "No. 00318", bounds: "[500, 650]", tag: "US-FINRA", verdict: "True",    tx: "0xc2d3…4b15" },
  { subject: "No. 00109", bounds: "[700, 850]", tag: "UK-FCA",   verdict: "False",   tx: "0x9e8f…7a26" },
  { subject: "No. 00087", bounds: "[400, 600]", tag: "SG-MAS",   verdict: "True",    tx: "0xa1b4…3c27" },
  { subject: "No. 00502", bounds: "[650, 800]", tag: "EU-MICA",  verdict: "Pending", tx: "—"           },
  { subject: "No. 00215", bounds: "[550, 700]", tag: "CH-FINMA", verdict: "True",    tx: "0x7d6e…5f38" },
];

const VERDICT_STYLE: Record<Verdict, { bg: string; text: string }> = {
  True:    { bg: "bg-primary-fixed/10", text: "text-primary-fixed" },
  False:   { bg: "bg-error/10",         text: "text-error" },
  Pending: { bg: "bg-secondary/10",     text: "text-secondary" },
};

export default function AuditorPage() {
  const { isConnected } = useAccount();
  const { grantConsent, revokeConsent, requestRangeProof, loading } =
    useScoreProver();

  const [subject, setSubject] = useState("");
  const [low, setLow] = useState("600");
  const [high, setHigh] = useState("700");
  const [jurisdiction, setJurisdiction] = useState("EU-MICA-2025-§142");
  const [auditor, setAuditor] = useState("");
  const [status, setStatus] = useState<string>("");
  const [tone, setTone] = useState<StatusTone>("info");

  const handleDispatch = async () => {
    if (!isConnected) {
      setStatus("Connect a wallet first.");
      setTone("err");
      return;
    }
    if (!isAddress(subject.trim())) {
      setStatus("Subject must be a 0x… address.");
      setTone("err");
      return;
    }
    const lo = Number(low);
    const hi = Number(high);
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo >= hi) {
      setStatus("Lower bound must be less than upper bound.");
      setTone("err");
      return;
    }
    try {
      setStatus("Encrypting bounds & dispatching writ…");
      setTone("info");
      await requestRangeProof(subject.trim() as `0x${string}`, lo, hi);
      setStatus(
        `Writ dispatched · ${jurisdiction} · bounds [${lo}, ${hi}] · awaiting ebool.`
      );
      setTone("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Writ refused.";
      setStatus(msg);
      setTone("err");
    }
  };

  const handleGrantConsent = async () => {
    if (!isConnected) {
      setStatus("Connect a wallet first.");
      setTone("err");
      return;
    }
    if (!isAddress(auditor.trim())) {
      setStatus("Enter a 0x… auditor address.");
      setTone("err");
      return;
    }
    try {
      setStatus("Sealing consent for this auditor…");
      setTone("info");
      await grantConsent(auditor.trim() as `0x${string}`);
      setStatus("Consent on file.");
      setTone("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Consent refused.";
      setStatus(msg);
      setTone("err");
    }
  };

  const handleRevokeConsent = async () => {
    if (!isConnected) {
      setStatus("Connect a wallet first.");
      setTone("err");
      return;
    }
    if (!isAddress(auditor.trim())) {
      setStatus("Enter a 0x… auditor address.");
      setTone("err");
      return;
    }
    try {
      setStatus("Revoking…");
      setTone("info");
      await revokeConsent(auditor.trim() as `0x${string}`);
      setStatus("Consent withdrawn.");
      setTone("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Revocation refused.";
      setStatus(msg);
      setTone("err");
    }
  };

  const toneClass =
    tone === "ok" ? "text-primary-fixed" :
    tone === "err" ? "text-error" : "text-secondary";

  return (
    <>
      {/* Header */}
      <section className="mb-12">
        <h2 className="text-5xl font-bold font-headline tracking-tighter text-tertiary mb-2">
          Auditor — Vidix
        </h2>
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-primary-fixed" />
          <p className="text-on-surface-variant font-body text-sm tracking-wide">
            Range-prove a borrower without ever seeing them. Compliance,
            without surveillance.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        {/* Writ of inquiry */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-surface-container-low p-8 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl">gavel</span>
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 flex items-center justify-center bg-secondary-container rounded-sm">
                <span className="material-symbols-outlined text-secondary text-sm">policy</span>
              </div>
              <h3 className="text-xl font-headline font-bold tracking-tight">
                Writ of Inquiry
              </h3>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Subject Address
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-sm focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                  placeholder="0x7a3f…9e1b"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Lower Bound
                  </label>
                  <input
                    type="number"
                    className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-xl focus:outline-none focus:border-primary-fixed transition-all"
                    value={low}
                    onChange={(e) => setLow(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Upper Bound
                  </label>
                  <input
                    type="number"
                    className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-xl focus:outline-none focus:border-primary-fixed transition-all"
                    value={high}
                    onChange={(e) => setHigh(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Jurisdiction Citation
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-outline/30 py-3 font-mono text-sm focus:outline-none focus:border-primary-fixed transition-all"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                />
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <p className="text-[10px] text-on-surface-variant max-w-[180px] leading-relaxed">
                  The coprocessor returns an{" "}
                  <span className="text-secondary font-mono">ebool</span> — and
                  nothing else.
                </p>
                <button
                  onClick={handleDispatch}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-fixed text-on-primary-fixed font-headline font-extrabold text-xs uppercase tracking-[0.2em] rounded-sm hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  Dispatch Writ
                </button>
              </div>

              {status && (
                <p className={`font-mono text-[11px] ${toneClass}`}>{status}</p>
              )}
            </div>
          </div>

          {/* Consent management */}
          <div className="bg-surface-container p-6 rounded-sm border border-outline-variant/10">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-secondary">
                Consent Registry
              </span>
              <span className="material-symbols-outlined text-secondary text-sm">
                key
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Auditor Address
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-outline/30 py-2 font-mono text-sm focus:outline-none focus:border-primary-fixed transition-all placeholder:text-surface-container-highest"
                placeholder="0x…"
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
              />
              <div className="flex gap-3 pt-3">
                <button
                  onClick={handleGrantConsent}
                  disabled={loading}
                  className="flex-1 py-2 bg-transparent border border-primary-fixed text-primary-fixed font-headline font-bold text-[10px] uppercase tracking-[0.2em] rounded-sm hover:bg-primary-fixed hover:text-on-primary-fixed transition-all disabled:opacity-50"
                >
                  Grant
                </button>
                <button
                  onClick={handleRevokeConsent}
                  disabled={loading}
                  className="flex-1 py-2 bg-transparent border border-error text-error font-headline font-bold text-[10px] uppercase tracking-[0.2em] rounded-sm hover:bg-error hover:text-on-error transition-all disabled:opacity-50"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-surface-container-low p-8 rounded-sm">
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-surface-container-highest rounded-sm">
                  <span className="material-symbols-outlined text-tertiary text-sm">menu_book</span>
                </div>
                <h3 className="text-xl font-headline font-bold tracking-tight">
                  Auditor Ledger
                </h3>
              </div>
              <span className="text-[10px] font-mono text-on-surface-variant tracking-widest">
                {LEDGER.length} recent writs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    {["Subject", "Bounds", "Jurisdiction", "Verdict", "Tx"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-2 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEDGER.map((row) => {
                    const v = VERDICT_STYLE[row.verdict];
                    return (
                      <tr
                        key={row.subject + row.tx}
                        className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors"
                      >
                        <td className="py-4 px-2">
                          <p className="font-mono text-sm text-tertiary">{row.subject}</p>
                        </td>
                        <td className="py-4 px-2 font-mono text-[11px] text-on-surface-variant">
                          {row.bounds}
                        </td>
                        <td className="py-4 px-2 font-mono text-[11px] text-on-surface-variant">
                          {row.tag}
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-0.5 ${v.bg} ${v.text} text-[9px] font-mono rounded-sm tracking-widest`}>
                            {row.verdict.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-2 font-mono text-[10px] text-on-surface-variant tracking-tighter">
                          {row.tx}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
