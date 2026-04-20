"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { usePassport } from "@/hooks/usePassport";
import { useDecryptScoreForDisplay } from "@/hooks/useShadowScorer";

function formatDate(seconds: number | null) {
  if (!seconds) return "—";
  return new Date(seconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function truncate(addr?: string | null) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}\u2026${addr.slice(-4)}`;
}

const CONSUMERS = [
  {
    name: "Helix Pool",
    tag: "LENDING · 0xA71c…4f8E",
    state: "Active",
    last: "last read · 2h ago",
    stamp: "oxblood",
    rotate: "-1deg",
  },
  {
    name: "Morrow",
    tag: "INSURANCE · 0xB32d…9a1F",
    state: "Active",
    last: "last read · 1d ago",
    stamp: "oxblood",
    rotate: "0.5deg",
  },
  {
    name: "Vellum Pool",
    tag: "RWA UW · 0xC58a…2e7B",
    state: "Active",
    last: "last read · 6d ago",
    stamp: "blue",
    rotate: "-0.8deg",
  },
  {
    name: "Silent·DAO",
    tag: "VOTING · 0xD91e…7c3D",
    state: "Review",
    last: "requested · 14m ago",
    stamp: "blue",
    rotate: "0.6deg",
  },
];

const ACTIVITY = [
  {
    when: "2 min",
    action: "qualifies(▓▓▓)",
    who: "Helix Pool",
    sum: <span className="redact-block" style={{ fontSize: 12 }}>▓▓▓</span>,
    sumUnit: "USDC",
    tx: "0x9f3a…b21e",
    verdict: "Approved",
    verdictColor: "oxblood",
  },
  {
    when: "2 hr",
    action: "readEncryptedScore()",
    who: "Morrow",
    sum: "—",
    sumUnit: "",
    tx: "0xa1b2…4c5e",
    verdict: "Noted",
    verdictColor: "blue",
  },
  {
    when: "1 day",
    action: "borrow()",
    who: "Vellum Pool",
    sum: "12,500",
    sumUnit: "USDC",
    tx: "0xe7f8…7d8e",
    verdict: "Settled",
    verdictColor: "oxblood",
  },
  {
    when: "3 days",
    action: "requestRangeProof([600,700])",
    who: "Auditor: GuildReg",
    sum: "—",
    sumUnit: "",
    tx: "0x3c4d…d6e7",
    verdict: "Proven",
    verdictColor: "olive",
  },
  {
    when: "6 days",
    action: "repay()",
    who: "Helix Pool",
    sum: "8,200",
    sumUnit: "USDC",
    tx: "0xfe01…89ab",
    verdict: "Honored",
    verdictColor: "oxblood",
  },
  {
    when: "12 days",
    action: "computeScore()",
    who: "ShadowScorer",
    sum: "—",
    sumUnit: "",
    tx: "0x5a6b…ef01",
    verdict: "Resolved",
    verdictColor: "blue",
  },
] as const;

const COMPOSITION = [
  { label: "punctuality", weight: "× 4", pct: 82, color: "oxblood" },
  { label: "commerce", weight: "× 2", pct: 65, color: "oxblood" },
  { label: "repayments", weight: "× 30", pct: 74, color: "oxblood" },
  { label: "utilization penalty", weight: "− 1", pct: 22, color: "olive" },
];

export default function PassportPage() {
  const { address, isConnected } = useAccount();
  const { state: passport, mint, loading: mintLoading } = usePassport();
  const { score, reveal, loading: revealLoading } = useDecryptScoreForDisplay();
  const [sealStatus, setSealStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) setSealStatus(null);
  }, [isConnected]);

  const handleMint = async () => {
    setSealStatus("minting passport…");
    try {
      await mint();
      setSealStatus("passport issued.");
    } catch (err) {
      setSealStatus((err as Error).message ?? "mint failed.");
    }
  };

  const handleReveal = async () => {
    setSealStatus("requesting local permit…");
    try {
      await reveal();
      setSealStatus("seal broken locally.");
    } catch (err) {
      setSealStatus((err as Error).message ?? "reveal failed.");
    }
  };

  const enrolledDate = formatDate(passport.issuedAt);

  return (
    <div className="max-w-col mx-auto px-8 py-12">
      {/* Dossier header */}
      <div
        className="relative mb-10 pb-8"
        style={{ borderBottom: "2px solid var(--ink)" }}
      >
        <div className="flex flex-wrap justify-between items-end gap-6">
          <div>
            <div
              className="typewriter text-[11px] tracking-[0.3em]"
              style={{ color: "var(--oxblood)" }}
            >
              § DOSSIER
            </div>
            <h1 className="fell text-6xl leading-[0.95] mt-3">
              Bearer{" "}
              <em>
                No. {passport.tokenId ? String(passport.tokenId).padStart(5, "0") : "00421"}.
              </em>
            </h1>
            <div
              className="mt-4 flex flex-wrap gap-x-8 gap-y-2 typewriter text-[11px] tracking-[0.15em]"
              style={{ color: "var(--ink-soft)" }}
            >
              <span>WALLET · {truncate(address ?? null)}</span>
              <span>ENROLLED · {enrolledDate}</span>
              <span>TIER · PRIME·B</span>
              <span style={{ color: "var(--oxblood)" }}>
                ● {passport.exists ? "ACTIVE" : "UNENROLLED"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            {passport.exists ? (
              <>
                <button className="btn-plain text-[11px]">Export Proof</button>
                <Link href="/borrow" className="btn-wax text-[11px] no-underline">
                  Request a Loan
                </Link>
              </>
            ) : (
              <button
                className="btn-wax text-[11px]"
                onClick={handleMint}
                disabled={mintLoading || !isConnected}
              >
                {mintLoading ? "Minting…" : "Issue My Passport"}
              </button>
            )}
          </div>
        </div>

        <div
          className="hidden lg:block stamp-circle"
          style={{ position: "absolute", top: -10, right: 220 }}
        >
          Filed<br />12 · APR<br />2026<br />Vidix
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Sealed score */}
        <div className="col-span-12 lg:col-span-7 passport-doc">
          <svg
            className="flourish-corner"
            style={{ top: 14, left: 14 }}
            viewBox="0 0 50 50"
          >
            <path
              d="M 2 48 Q 2 2, 48 2 M 10 40 Q 10 10, 40 10"
              stroke="var(--ink)"
              strokeWidth="0.6"
              fill="none"
            />
          </svg>
          <svg
            className="flourish-corner"
            style={{ top: 14, right: 14, transform: "scaleX(-1)" }}
            viewBox="0 0 50 50"
          >
            <path
              d="M 2 48 Q 2 2, 48 2 M 10 40 Q 10 10, 40 10"
              stroke="var(--ink)"
              strokeWidth="0.6"
              fill="none"
            />
          </svg>
          <svg
            className="flourish-corner"
            style={{ bottom: 14, left: 14, transform: "scaleY(-1)" }}
            viewBox="0 0 50 50"
          >
            <path
              d="M 2 48 Q 2 2, 48 2 M 10 40 Q 10 10, 40 10"
              stroke="var(--ink)"
              strokeWidth="0.6"
              fill="none"
            />
          </svg>
          <svg
            className="flourish-corner"
            style={{ bottom: 14, right: 14, transform: "scale(-1)" }}
            viewBox="0 0 50 50"
          >
            <path
              d="M 2 48 Q 2 2, 48 2 M 10 40 Q 10 10, 40 10"
              stroke="var(--ink)"
              strokeWidth="0.6"
              fill="none"
            />
          </svg>

          <div className="flex justify-between items-start mb-6">
            <div>
              <div
                className="fell italic text-xl"
                style={{ color: "var(--oxblood)" }}
              >
                — your credit score —
              </div>
              <div
                className="typewriter text-[10px] tracking-[0.2em] mt-1"
                style={{ color: "var(--ink-soft)" }}
              >
                AS COMPUTED BY THE BUREAU · SEALED UNDER FHE
              </div>
            </div>
            <div className="flex gap-2">
              <div
                className="stamp stamp-oxblood"
                style={{ fontSize: 10 }}
              >
                Classified
              </div>
            </div>
          </div>

          <div className="text-center py-8 relative">
            <div
              className="fell italic text-sm mb-2"
              style={{ color: "var(--ink-soft)" }}
            >
              the cipher reads
            </div>
            {score !== null ? (
              <div
                className="fell leading-none"
                style={{ fontSize: 120, color: "var(--ink)" }}
              >
                {String(score)}
              </div>
            ) : (
              <div className="score-sealed">▓▓▓</div>
            )}
            <div
              className="typewriter text-[11px] tracking-[0.25em] mt-4"
              style={{ color: "var(--oxblood)" }}
            >
              {score !== null ? "euint64 · unsealed locally" : "euint64 · unopenable"}
            </div>

            <div className="mt-8">
              <button
                className="btn-plain text-[11px]"
                onClick={handleReveal}
                disabled={revealLoading || !isConnected}
              >
                <span>🔑</span>{" "}
                {revealLoading ? "Unsealing…" : "Break the Seal (local)"}
              </button>
            </div>

            {sealStatus ? (
              <div
                className="mt-5 typewriter text-xs tracking-[0.2em]"
                style={{ color: "var(--oxblood)" }}
              >
                {sealStatus}
              </div>
            ) : null}
          </div>

          <div
            className="mt-6 pt-6"
            style={{ borderTop: "1px dashed var(--crease-strong)" }}
          >
            <div className="grid grid-cols-3 gap-6">
              <SummaryField label="PERCENTILE">
                Top{" "}
                <span style={{ color: "var(--oxblood)" }}>18%</span>
              </SummaryField>
              <SummaryField label="LAST UPDATED">
                6h <span style={{ color: "var(--oxblood)" }}>12m</span>
              </SummaryField>
              <SummaryField label="PERMITS GRANTED">
                4 <span style={{ color: "var(--oxblood)" }}>active</span>
              </SummaryField>
            </div>

            <div className="mt-6">
              <div
                className="typewriter text-[9px] tracking-[0.2em]"
                style={{ color: "var(--ink-soft)" }}
              >
                CIPHER HANDLE
              </div>
              <div
                className="courier text-xs mt-1"
                style={{
                  color: "var(--oxblood-dark)",
                  wordBreak: "break-all",
                }}
              >
                0x9f3a7e8b4c2d1e0a…a47db21ef38c9d52
              </div>
            </div>
          </div>

          <div
            className="coffee-stain"
            style={{ bottom: -60, left: -50, opacity: 0.5 }}
          />
        </div>

        {/* Small figures */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-6">
          <SmallFigure
            label="LOANS APPROVED"
            value={<>11</>}
            caption="+ 2 this week"
            captionClass="hand text-lg"
            captionColor="var(--seal-blue)"
          >
            <svg className="mt-4 w-full" height={36} viewBox="0 0 160 36">
              <polyline
                points="0,28 20,26 40,22 60,18 80,20 100,14 120,10 140,8 160,5"
                fill="none"
                stroke="var(--oxblood)"
                strokeWidth="1.5"
              />
              <circle cx="160" cy="5" r="2.5" fill="var(--oxblood)" />
            </svg>
          </SmallFigure>

          <SmallFigure
            label="BORROWED · TOTAL"
            value={
              <>
                $48
                <span style={{ color: "var(--oxblood)", fontSize: "0.4em" }}>
                  .2k
                </span>
              </>
            }
            caption="across 4 houses"
            captionClass="serif italic text-sm"
            captionColor="var(--ink-soft)"
          >
            <svg className="mt-4 w-full" height={36} viewBox="0 0 160 36">
              <polyline
                points="0,30 20,26 40,28 60,22 80,18 100,20 120,16 140,10 160,8"
                fill="none"
                stroke="var(--seal-blue)"
                strokeWidth="1.5"
              />
              <circle cx="160" cy="8" r="2.5" fill="var(--seal-blue)" />
            </svg>
          </SmallFigure>

          <SmallFigure
            label="DEFAULTS"
            value={
              <>
                0.00<span style={{ color: "var(--oxblood)" }}>%</span>
              </>
            }
            caption="— perfect record —"
            captionClass="hand text-lg"
            captionColor="var(--seal-blue)"
          >
            <div
              className="stamp stamp-olive"
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                fontSize: 9,
                transform: "rotate(-8deg)",
              }}
            >
              Honored
            </div>
          </SmallFigure>

          <SmallFigure
            label="AVG. APR RECEIVED"
            value={
              <>
                6.8<span style={{ color: "var(--oxblood)" }}>%</span>
              </>
            }
            caption={
              <>
                market median <span className="hand-strike">11.2%</span>
              </>
            }
            captionClass="serif italic text-sm"
            captionColor="var(--ink-soft)"
          >
            <div className="flex items-end gap-1 h-8 mt-4">
              <div className="w-full" style={{ background: "var(--seal-blue)", height: "40%" }} />
              <div className="w-full" style={{ background: "var(--seal-blue)", height: "55%" }} />
              <div className="w-full" style={{ background: "var(--oxblood)", height: "35%" }} />
              <div className="w-full" style={{ background: "var(--oxblood)", height: "50%" }} />
              <div className="w-full" style={{ background: "var(--oxblood)", height: "30%" }} />
              <div className="w-full" style={{ background: "var(--oxblood)", height: "25%" }} />
            </div>
          </SmallFigure>
        </div>
      </div>

      {/* Composition + Consumers */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="letter" style={{ padding: "40px 50px" }}>
            <div
              className="flex items-baseline justify-between mb-6 pb-4"
              style={{ borderBottom: "1px dotted var(--crease-strong)" }}
            >
              <div>
                <div
                  className="typewriter text-[10px] tracking-[0.2em]"
                  style={{ color: "var(--oxblood)" }}
                >
                  § APPENDIX &nbsp;·&nbsp; SCORE COMPOSITION
                </div>
                <div className="fell text-3xl italic mt-1">
                  Whence your figure <em>arises.</em>
                </div>
              </div>
              <div
                className="hand text-2xl"
                style={{ color: "var(--seal-blue)" }}
              >
                redacted, naturally
              </div>
            </div>

            <div className="space-y-6">
              {COMPOSITION.map((c) => (
                <div key={c.label}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="fell italic text-lg">
                      {c.label}
                      <span
                        className="typewriter text-xs ml-2"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        {c.weight}
                      </span>
                    </span>
                    <span className="redact-block" style={{ fontSize: 18 }}>
                      ▓▓▓
                    </span>
                  </div>
                  <div className="ink-bar-track">
                    <div
                      className="ink-bar-fill"
                      style={{
                        width: `${c.pct}%`,
                        background:
                          c.color === "olive"
                            ? "var(--olive)"
                            : "var(--oxblood)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="stitch my-8" />

            <div>
              <div
                className="typewriter text-[10px] tracking-[0.2em] mb-3"
                style={{ color: "var(--ink-soft)" }}
              >
                THE RECIPE, SET IN TYPE
              </div>
              <pre
                className="p-5 courier text-[12px] leading-relaxed whitespace-pre-wrap"
                style={{ background: "var(--paper-2)", color: "var(--ink)" }}
              >
{`function computeScore(address borrower) external {
  EncryptedProfile memory p = _profiles[borrower];
  euint64 payWeighted = FHE.mul(FHE.asEuint64(p.paymentHistory), 4);
  euint64 volBoost    = FHE.div(p.transactionVolume, 10000);
  euint64 repayBoost  = FHE.mul(FHE.asEuint64(p.repayments), 30);
  euint64 utilPenalty = FHE.asEuint64(p.utilization);
  euint64 score       = FHE.add(300,
                           FHE.sub(FHE.add(FHE.add(payWeighted, volBoost), repayBoost),
                                   utilPenalty));
  _creditScores[borrower] = score;
  FHE.allowThis(score);
  FHE.allow(score, borrower);  // you may unseal your own
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Consumers rolodex */}
        <div className="col-span-12 lg:col-span-4">
          <div className="card-aged">
            <div className="flex justify-between items-baseline mb-5">
              <div>
                <div
                  className="typewriter text-[10px] tracking-[0.2em]"
                  style={{ color: "var(--oxblood)" }}
                >
                  § PERMITTED PARTIES
                </div>
                <div className="fell italic text-2xl mt-1">who may inquire</div>
              </div>
              <span
                className="hand text-xl"
                style={{ color: "var(--seal-blue)" }}
              >
                four, presently
              </span>
            </div>

            <div className="space-y-4">
              {CONSUMERS.map((c) => (
                <div
                  key={c.name}
                  className="tag-card w-full"
                  style={{ transform: `rotate(${c.rotate})` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="fell text-lg italic">{c.name}</div>
                      <div
                        className="typewriter text-[9px] tracking-[0.2em] mt-1"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        {c.tag}
                      </div>
                    </div>
                    <div
                      className={`stamp stamp-${c.stamp}`}
                      style={{ fontSize: 8, padding: "2px 6px" }}
                    >
                      {c.state}
                    </div>
                  </div>
                  <div
                    className="flex justify-between mt-2 typewriter text-[10px]"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    <span>{c.last}</span>
                    <span style={{ color: "var(--oxblood)" }}>
                      {c.state === "Review" ? "pending" : "allowTransient"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-plain w-full justify-center mt-6 text-[11px]">
              Manage Permissions →
            </button>
          </div>
        </div>
      </div>

      {/* Ledger of activity */}
      <div className="letter" style={{ padding: "40px 50px" }}>
        <div
          className="flex items-baseline justify-between mb-6 pb-4"
          style={{ borderBottom: "1px dotted var(--crease-strong)" }}
        >
          <div>
            <div
              className="typewriter text-[10px] tracking-[0.2em]"
              style={{ color: "var(--oxblood)" }}
            >
              § THE LEDGER OF ACTIVITY
            </div>
            <div className="fell text-3xl italic mt-1">
              Every entry, recorded in <em>longhand.</em>
            </div>
          </div>
          <div className="flex gap-5 typewriter text-[11px] tracking-[0.15em]">
            <span
              style={{
                color: "var(--oxblood)",
                borderBottom: "1px solid var(--oxblood)",
              }}
            >
              ALL
            </span>
            <span style={{ color: "var(--ink-soft)" }}>LOANS</span>
            <span style={{ color: "var(--ink-soft)" }}>READS</span>
            <span style={{ color: "var(--ink-soft)" }}>AUDITS</span>
          </div>
        </div>

        <table className="ledger">
          <thead>
            <tr>
              <th>when</th>
              <th>action</th>
              <th>counterparty</th>
              <th>sum</th>
              <th>transaction</th>
              <th className="text-right">verdict</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITY.map((a, i) => (
              <tr key={i}>
                <td style={{ color: "var(--ink-soft)" }}>{a.when}</td>
                <td>{a.action}</td>
                <td>{a.who}</td>
                <td>
                  {a.sum}
                  {a.sumUnit ? ` ${a.sumUnit}` : ""}
                </td>
                <td
                  className="courier text-xs"
                  style={{ color: "var(--oxblood-dark)" }}
                >
                  {a.tx}
                </td>
                <td className="text-right">
                  <span
                    className={`stamp stamp-${a.verdictColor}`}
                    style={{ fontSize: 9, padding: "2px 8px" }}
                  >
                    {a.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className="mt-6 hand text-xl"
          style={{ color: "var(--seal-blue)", textAlign: "right" }}
        >
          — kept by the Bureau, on your behalf.
        </div>
      </div>
    </div>
  );
}

function SummaryField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="typewriter text-[9px] tracking-[0.2em]"
        style={{ color: "var(--ink-soft)" }}
      >
        {label}
      </div>
      <div className="fell text-3xl italic mt-1">{children}</div>
    </div>
  );
}

function SmallFigure({
  label,
  value,
  caption,
  captionClass,
  captionColor,
  children,
}: {
  label: string;
  value: React.ReactNode;
  caption: React.ReactNode;
  captionClass: string;
  captionColor: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="card-plain"
      style={{ background: "var(--paper-3)", position: "relative" }}
    >
      <div
        className="typewriter text-[9px] tracking-[0.2em]"
        style={{ color: "var(--oxblood)" }}
      >
        {label}
      </div>
      <div className="fell text-6xl leading-none mt-3">{value}</div>
      <div className={`mt-2 ${captionClass}`} style={{ color: captionColor }}>
        {caption}
      </div>
      {children}
    </div>
  );
}
