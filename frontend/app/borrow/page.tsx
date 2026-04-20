"use client";

import { useMemo, useState } from "react";
import { useShadowScorer } from "@/hooks/useShadowScorer";

function estimateScore(pay: number, util: number, vol: number, rep: number) {
  const payWeighted = pay * 4;
  const volBoost = Math.floor(vol / 10_000);
  const repayBoost = rep * 30;
  const utilPenalty = util;
  const raw = 300 + payWeighted + volBoost + repayBoost - utilPenalty;
  return Math.max(300, Math.min(850, raw));
}

function tier(score: number) {
  if (score >= 780) return "SUPERPRIME · A";
  if (score >= 720) return "PRIME · A";
  if (score >= 660) return "PRIME · B";
  if (score >= 600) return "NEAR-PRIME";
  if (score >= 500) return "SUBPRIME";
  return "DEEP-SUBPRIME";
}

export default function BorrowPage() {
  const [pay, setPay] = useState(75);
  const [util, setUtil] = useState(30);
  const [vol, setVol] = useState(500_000);
  const [rep, setRep] = useState(7);
  const [status, setStatus] = useState<string | null>(null);
  const { submitProfile, computeScore, loading } = useShadowScorer();

  const score = useMemo(() => estimateScore(pay, util, vol, rep), [pay, util, vol, rep]);
  const barPct = Math.max(4, Math.min(100, ((score - 300) / 550) * 100));

  const handleSeal = async () => {
    setStatus("encrypting locally…");
    try {
      await submitProfile(pay, util, vol, rep);
      setStatus("profile sealed · computing score…");
      await computeScore();
      setStatus("score sealed on-chain.");
    } catch (err) {
      setStatus((err as Error).message ?? "dispatch failed.");
    }
  };

  return (
    <div className="max-w-col mx-auto px-8 py-16">
      {/* Page header */}
      <div
        className="flex flex-wrap items-end justify-between gap-4 mb-10 pb-6"
        style={{ borderBottom: "2px solid var(--ink)" }}
      >
        <div>
          <div
            className="typewriter text-[11px] tracking-[0.3em]"
            style={{ color: "var(--oxblood)" }}
          >
            § INTAKE &nbsp;·&nbsp; STEP 01 OF 03
          </div>
          <h1 className="fell text-6xl leading-[0.95] mt-3">
            The <em>intake interview.</em>
          </h1>
        </div>
        <div className="flex items-center gap-8 text-sm">
          <Step label="ENCRYPT" active />
          <Dash />
          <Step label="COMPUTE" />
          <Dash />
          <Step label="ISSUE" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Form */}
        <div className="col-span-12 lg:col-span-7">
          <div className="letter" style={{ padding: "50px 60px" }}>
            <div
              className="flex justify-between items-start mb-8 pb-6"
              style={{ borderBottom: "1px dotted var(--crease-strong)" }}
            >
              <div>
                <div
                  className="typewriter text-[10px] tracking-[0.2em]"
                  style={{ color: "var(--oxblood)" }}
                >
                  FORM No. <span className="courier">421.V</span>
                </div>
                <div className="fell italic text-3xl mt-2">
                  Declaration of Particulars
                </div>
                <div
                  className="serif italic mt-1"
                  style={{ color: "var(--ink-soft)" }}
                >
                  to be completed in your own hand — we do not watch.
                </div>
              </div>
              <div className="stamp stamp-oxblood" style={{ fontSize: 11 }}>
                Confidential
              </div>
            </div>

            <Question
              roman="i."
              title="On your punctuality"
              subtitle="(payment history, 0–100)"
              value={pay}
              display={String(pay)}
              min={0}
              max={100}
              step={1}
              onChange={setPay}
              marks={["NEGLIGENT", "STEADY", "PRISTINE"]}
            />

            <div className="stitch my-6" />

            <Question
              roman="ii."
              title="On your discipline"
              subtitle="(credit utilization, %)"
              value={util}
              display={String(util)}
              min={0}
              max={100}
              step={1}
              onChange={setUtil}
              marks={["RESTRAINED", "MODERATE", "MAXED"]}
            />

            <div className="stitch my-6" />

            <Question
              roman="iii."
              title="On your commerce"
              subtitle="(transaction volume, USDC)"
              value={vol}
              display={vol.toLocaleString()}
              min={0}
              max={2_000_000}
              step={10_000}
              onChange={setVol}
            />

            <div className="stitch my-6" />

            <Question
              roman="iv."
              title="On your repayments"
              subtitle="(loans repaid on-time)"
              value={rep}
              display={String(rep)}
              min={0}
              max={20}
              step={1}
              onChange={setRep}
              marks={["NONE", "SEASONED"]}
            />

            <div
              className="mt-12 pt-8"
              style={{ borderTop: "2px solid var(--ink)" }}
            >
              <div className="flex items-end justify-between gap-6">
                <div className="flex-1">
                  <div
                    className="typewriter text-[10px] tracking-[0.2em] mb-2"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    SIGNED, SEALED & DELIVERED
                  </div>
                  <div
                    className="fell italic text-lg leading-snug"
                    style={{ color: "var(--ink-soft)", maxWidth: 360 }}
                  >
                    By pressing the seal, your figures are encrypted in your
                    browser. We never see them — neither plain nor whispered.
                    We merely receive the cipher.
                  </div>
                </div>
                <button
                  className="btn-wax whitespace-nowrap"
                  onClick={handleSeal}
                  disabled={loading}
                >
                  <span>✉</span>{" "}
                  {loading ? "Dispatching…" : "Seal & Dispatch"}
                </button>
              </div>
              {status ? (
                <div
                  className="mt-5 typewriter text-xs tracking-[0.2em]"
                  style={{ color: "var(--oxblood)" }}
                >
                  {status}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Cipher preview */}
        <div className="col-span-12 lg:col-span-5">
          <div className="sticky top-8 space-y-6">
            <div
              className="card-plain relative"
              style={{ background: "var(--paper-3)" }}
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <div
                    className="typewriter text-[10px] tracking-[0.2em]"
                    style={{ color: "var(--oxblood)" }}
                  >
                    ENVELOPE CONTENTS
                  </div>
                  <div className="fell italic text-2xl mt-1">
                    What we will <em>actually</em> see.
                  </div>
                </div>
                <div
                  className="stamp stamp-oxblood"
                  style={{ fontSize: 9 }}
                >
                  Sealed
                </div>
              </div>
              <div
                className="serif italic text-sm mb-5"
                style={{ color: "var(--ink-soft)" }}
              >
                These are the only values that leave your browser. The original
                figures remain with you, where they belong.
              </div>

              <div className="space-y-4">
                <CipherRow
                  label="·i — PUNCTUALITY · InEuint32"
                  hash="0x9f3a7e8b4c2d1e0a…a47db21e"
                />
                <CipherRow
                  label="·ii — DISCIPLINE · InEuint32"
                  hash="0xa1b2c3d4e5f60718…2a3f4c5e"
                />
                <CipherRow
                  label="·iii — COMMERCE · InEuint64"
                  hash="0xe7f8a9b0c1d2e3f4…5b6c7d8e"
                />
                <CipherRow
                  label="·iv — REPAYMENTS · InEuint32"
                  hash="0x3c4d5e6f708192a3…b4c5d6e7"
                />
              </div>
            </div>

            <div
              className="card-plain relative"
              style={{
                background: "var(--paper-3)",
                transform: "rotate(0.5deg)",
              }}
            >
              <div className="flex justify-between items-baseline mb-3">
                <div>
                  <div
                    className="typewriter text-[10px] tracking-[0.2em]"
                    style={{ color: "var(--oxblood)" }}
                  >
                    ESTIMATED · YOUR EYES ONLY
                  </div>
                  <div className="fell italic text-xl mt-1">
                    A reckoning in private.
                  </div>
                </div>
                <div
                  className="hand text-xl"
                  style={{
                    color: "var(--seal-blue)",
                    transform: "rotate(-4deg)",
                  }}
                >
                  only you.
                </div>
              </div>
              <div className="flex items-end gap-4 mt-4">
                <div
                  className="fell text-8xl leading-none"
                  style={{ color: "var(--ink)" }}
                >
                  {score}
                </div>
                <div className="pb-3">
                  <div
                    className="fell italic text-xl"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    / 850
                  </div>
                  <div
                    className="typewriter text-[10px] tracking-[0.2em] mt-1"
                    style={{ color: "var(--oxblood)" }}
                  >
                    {tier(score)}
                  </div>
                </div>
              </div>
              <div className="ink-bar-track mt-5">
                <div className="ink-bar-fill" style={{ width: `${barPct}%` }} />
              </div>
              <div
                className="serif italic text-sm mt-3"
                style={{ color: "var(--ink-soft)" }}
              >
                Approximated from your sliders. The on-chain figure is computed
                in cipher.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className="flex items-center gap-2 typewriter text-[11px] tracking-[0.15em]"
      style={{
        color: active ? "var(--oxblood)" : "var(--ink-soft)",
        opacity: active ? 1 : 0.5,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{
          background: active ? "var(--oxblood)" : "var(--crease-strong)",
        }}
      />
      {label}
    </span>
  );
}

function Dash() {
  return <span style={{ color: "var(--crease-strong)" }}>——</span>;
}

function Question({
  roman,
  title,
  subtitle,
  value,
  display,
  min,
  max,
  step,
  onChange,
  marks,
}: {
  roman: string;
  title: string;
  subtitle: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  marks?: string[];
}) {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-baseline">
        <label>
          <span className="fell italic text-2xl">
            {roman} &nbsp;{title}
          </span>
          <span
            className="serif italic text-base ml-2"
            style={{ color: "var(--ink-soft)" }}
          >
            {subtitle}
          </span>
        </label>
        <div
          className="fell text-5xl italic"
          style={{ color: "var(--oxblood)" }}
        >
          {display}
        </div>
      </div>
      <input
        type="range"
        className="quill mt-3"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {marks ? (
        <div
          className="flex justify-between typewriter text-[10px] tracking-[0.2em] mt-1"
          style={{ color: "var(--ink-soft)" }}
        >
          {marks.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CipherRow({ label, hash }: { label: string; hash: string }) {
  return (
    <div>
      <div
        className="typewriter text-[10px] tracking-[0.2em]"
        style={{ color: "var(--ink-soft)" }}
      >
        {label}
      </div>
      <div
        className="courier text-[11px] leading-relaxed mt-1 p-2"
        style={{
          background: "rgba(26,18,10,0.04)",
          color: "var(--oxblood-dark)",
          wordBreak: "break-all",
        }}
      >
        {hash}
      </div>
    </div>
  );
}
