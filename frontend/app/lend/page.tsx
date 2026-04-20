"use client";

import { useState } from "react";
import { useShadowLender } from "@/hooks/useShadowLender";

const APPLICATIONS = [
  {
    no: "00421",
    addr: "0x7a3f…9e1b",
    amount: "25,000 USDC",
    term: "90d",
    ltv: "LTV · 0.65",
    ebool: "ebool · true",
    state: "qualified",
    featured: true,
    stampRotate: "5deg",
  },
  {
    no: "00318",
    addr: "0xb2c1…4f0a",
    amount: "8,400 USDC",
    term: "60d",
    ltv: "LTV · 0.50",
    ebool: "ebool · true",
    state: "qualified",
    featured: false,
    stampRotate: "-3deg",
  },
  {
    no: "00109",
    addr: "0xf8e7…1d3c",
    amount: "42,000 USDC",
    term: "120d",
    ltv: "LTV · 0.70",
    ebool: "ebool · pending",
    state: "computing",
    featured: false,
    note: "coprocessor ETA ~8s",
  },
  {
    no: "00087",
    addr: "0x45ab…cd89",
    amount: "14,200 USDC",
    term: "—",
    ltv: "—",
    ebool: "ebool · false  ·  collateral returned",
    state: "denied",
    featured: false,
  },
] as const;

const POOL_STATS = [
  { label: "POOL · TVL", value: <>$1.84<span style={{ color: "var(--oxblood)" }}>M</span></> },
  { label: "UTILIZATION", value: <>68<span style={{ color: "var(--oxblood)" }}>%</span></> },
  { label: "ACTIVE LOANS", value: <>42</> },
  { label: "SUPPLY APR", value: <>8.4<span style={{ color: "var(--oxblood)" }}>%</span></> },
  { label: "DEFAULTS", value: <>0.3<span style={{ color: "var(--oxblood)" }}>%</span></> },
];

export default function LendPage() {
  const [threshold, setThreshold] = useState(620);
  const [amount, setAmount] = useState("25,000");
  const [ltv, setLtv] = useState("0.65");
  const [duration, setDuration] = useState("90");
  const [apr, setApr] = useState("9.2%");
  const [status, setStatus] = useState<string | null>(null);
  const { loading } = useShadowLender();

  const qualifyPct = Math.max(
    10,
    Math.min(98, 100 - ((threshold - 300) / 550) * 40),
  );

  const handlePost = async () => {
    setStatus("sealing threshold client-side…");
    try {
      await new Promise((r) => setTimeout(r, 400));
      setStatus(`policy posted · threshold ${threshold}.`);
    } catch (err) {
      setStatus((err as Error).message ?? "post failed.");
    }
  };

  return (
    <div className="max-w-col mx-auto px-8 py-16">
      {/* Header */}
      <div className="mb-10 pb-6" style={{ borderBottom: "2px solid var(--ink)" }}>
        <div
          className="typewriter text-[11px] tracking-[0.3em]"
          style={{ color: "var(--oxblood)" }}
        >
          § THE COUNTING-HOUSE
        </div>
        <h1 className="fell text-6xl leading-[0.95] mt-3">
          Approve, without <em>looking.</em>
        </h1>
        <p
          className="serif text-xl italic mt-4 max-w-3xl"
          style={{ color: "var(--ink-soft)" }}
        >
          Set your threshold. Seal it. The Bureau will inform you only of{" "}
          <em>yea</em> or <em>nay</em>. Your capital finds better borrowers
          without reading a single line of their history.
        </p>
      </div>

      {/* Pool stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {POOL_STATS.map((s) => (
          <div
            key={s.label}
            className="card-plain"
            style={{ background: "var(--paper-3)" }}
          >
            <div
              className="typewriter text-[9px] tracking-[0.2em]"
              style={{ color: "var(--oxblood)" }}
            >
              {s.label}
            </div>
            <div className="fell text-4xl italic mt-2">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Policy editor */}
        <div className="col-span-12 lg:col-span-7">
          <div className="letter" style={{ padding: "40px 50px" }}>
            <div
              className="flex items-start justify-between mb-8 pb-4"
              style={{ borderBottom: "1px dotted var(--crease-strong)" }}
            >
              <div>
                <div
                  className="typewriter text-[10px] tracking-[0.2em]"
                  style={{ color: "var(--oxblood)" }}
                >
                  POLICY · FORM 418.L
                </div>
                <h3 className="fell text-3xl italic mt-2">Set your threshold.</h3>
              </div>
              <div className="stamp stamp-oxblood" style={{ fontSize: 10 }}>
                Sealed Client-Side
              </div>
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-baseline">
                <label className="fell italic text-2xl">
                  Minimum qualifying figure
                </label>
                <div
                  className="fell text-6xl italic"
                  style={{ color: "var(--oxblood)" }}
                >
                  {threshold}
                </div>
              </div>
              <input
                type="range"
                className="quill mt-3"
                min={300}
                max={850}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
              />
              <div
                className="flex justify-between typewriter text-[10px] tracking-[0.2em] mt-1"
                style={{ color: "var(--ink-soft)" }}
              >
                <span>300 · SUBPRIME</span>
                <span>700 · PRIME</span>
                <span>850 · SUPERPRIME</span>
              </div>
            </div>

            <div className="stitch my-6" />

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <LineField label="LOAN AMOUNT (USDC)" value={amount} onChange={setAmount} />
              <LineField label="LOAN TO VALUE" value={ltv} onChange={setLtv} />
              <LineField label="DURATION (DAYS)" value={duration} onChange={setDuration} />
              <LineField label="TARGET APR" value={apr} onChange={setApr} />
            </div>

            <div className="stitch my-8" />

            {/* Distribution */}
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <div
                  className="typewriter text-[10px] tracking-[0.2em]"
                  style={{ color: "var(--oxblood)" }}
                >
                  DISTRIBUTION · ESTIMATED POOL
                </div>
                <div
                  className="hand text-lg"
                  style={{ color: "var(--seal-blue)" }}
                >
                  ~{Math.round(qualifyPct)}% qualify
                </div>
              </div>
              <div className="flex items-end gap-2 h-32">
                {[
                  { bucket: 300, h: 15, muted: true },
                  { bucket: 400, h: 25, muted: true },
                  { bucket: 500, h: 40, muted: true },
                  { bucket: 600, h: 60, muted: true },
                  { bucket: threshold, h: 85, marker: true },
                  { bucket: 700, h: 95 },
                  { bucket: 800, h: 70 },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end"
                  >
                    <div
                      className="w-full"
                      style={{
                        background: b.muted
                          ? "var(--crease-strong)"
                          : "var(--oxblood)",
                        height: `${b.h}%`,
                      }}
                    />
                    <div
                      className="typewriter text-[9px] mt-1"
                      style={{
                        color: b.marker
                          ? "var(--oxblood)"
                          : "var(--ink-soft)",
                      }}
                    >
                      {b.marker ? `${b.bucket}▲` : b.bucket}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6" style={{ borderTop: "2px solid var(--ink)" }}>
              <button
                className="btn-wax w-full justify-center"
                onClick={handlePost}
                disabled={loading}
              >
                <span>✉</span>{" "}
                {loading ? "Posting…" : "Seal Threshold & Post Policy"}
              </button>
              {status ? (
                <div
                  className="mt-4 typewriter text-xs tracking-[0.2em]"
                  style={{ color: "var(--oxblood)" }}
                >
                  {status}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Applications queue */}
        <div className="col-span-12 lg:col-span-5">
          <div className="card-aged">
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <div
                  className="typewriter text-[10px] tracking-[0.2em]"
                  style={{ color: "var(--oxblood)" }}
                >
                  § INBOX · APPLICATIONS
                </div>
                <div className="fell text-2xl italic mt-1">
                  Seven envelopes await.
                </div>
              </div>
              <span
                className="flex items-center gap-2 typewriter text-[10px] tracking-[0.15em]"
                style={{ color: "var(--oxblood)" }}
              >
                <span className="live-dot" /> IN · REAL TIME
              </span>
            </div>

            <div className="space-y-4">
              {APPLICATIONS.map((a) => (
                <Application key={a.no} app={a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LineField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        className="typewriter text-[10px] tracking-[0.2em]"
        style={{ color: "var(--ink-soft)" }}
      >
        {label}
      </label>
      <input
        type="text"
        className="line-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Application({ app }: { app: (typeof APPLICATIONS)[number] }) {
  const qualified = app.state === "qualified";
  const computing = app.state === "computing";
  const denied = app.state === "denied";

  const stampColor = qualified ? "oxblood" : computing ? "blue" : "olive";
  const stampLabel = qualified ? "Qualified" : computing ? "Computing" : "Denied";

  return (
    <div
      className="card-plain"
      style={{
        background: "var(--paper-3)",
        border: qualified && app.featured
          ? "1.5px solid var(--oxblood)"
          : "1px solid var(--crease-strong)",
        position: "relative",
        opacity: denied ? 0.55 : computing ? 0.9 : 1,
      }}
    >
      {qualified ? (
        <div
          className={`stamp stamp-${stampColor}`}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 9,
            transform: `rotate(${app.stampRotate ?? "-3deg"})`,
          }}
        >
          {stampLabel}
        </div>
      ) : null}

      {!qualified ? (
        <div className="flex justify-between items-start">
          <div>
            <div
              className="typewriter text-[9px] tracking-[0.2em]"
              style={{ color: "var(--ink-soft)" }}
            >
              APP · NO. {app.no} &nbsp;·&nbsp; {app.addr}
            </div>
            <div className={`fell text-2xl italic mt-1 ${denied ? "hand-strike" : ""}`}>
              {app.amount}
            </div>
          </div>
          <div
            className={`stamp stamp-${stampColor}`}
            style={{ fontSize: 9 }}
          >
            {stampLabel}
          </div>
        </div>
      ) : (
        <>
          <div
            className="typewriter text-[9px] tracking-[0.2em]"
            style={{ color: "var(--ink-soft)" }}
          >
            APP · NO. {app.no} &nbsp;·&nbsp; {app.addr}
          </div>
          <div className="fell text-2xl italic mt-1">{app.amount}</div>
        </>
      )}

      {!denied ? (
        <div
          className="grid grid-cols-3 gap-3 mt-3 typewriter text-xs"
          style={{ color: "var(--ink-soft)" }}
        >
          <div>{app.term}</div>
          <div>{app.ltv}</div>
          <div
            style={{
              color: computing ? "var(--seal-blue)" : "var(--oxblood)",
            }}
          >
            {app.ebool}
          </div>
        </div>
      ) : (
        <div
          className="mt-3 typewriter text-xs"
          style={{ color: "var(--ink-soft)" }}
        >
          {app.ebool}
        </div>
      )}

      {qualified ? (
        <div className="flex gap-2 mt-4">
          <button className="btn-wax flex-1 justify-center text-[10px] py-2 px-3">
            Settle
          </button>
          <button className="btn-plain flex-1 justify-center text-[10px] py-2 px-3">
            Review
          </button>
        </div>
      ) : computing && "note" in app ? (
        <div className="mt-3 hand text-lg" style={{ color: "var(--seal-blue)" }}>
          {(app as { note?: string }).note}
        </div>
      ) : null}
    </div>
  );
}
