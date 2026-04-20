import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ==================== HERO / THE LETTER ==================== */}
      <div className="max-w-col mx-auto px-8 pt-16 pb-24">
        <div className="grid grid-cols-12 gap-8 relative">
          {/* Left: The Letter */}
          <div className="col-span-12 lg:col-span-8 relative">
            <div className="letter relative margin-line ink-in">
              <div
                className="tape"
                style={{ top: "-10px", left: "60px", transform: "rotate(-4deg)" }}
              />
              <div
                className="tape"
                style={{ top: "-10px", right: "80px", transform: "rotate(6deg)" }}
              />

              <div style={{ position: "absolute", top: 30, right: 50 }}>
                <div className="postmark">
                  Vidix Bureau<br />★ Est. 2026 ★<br />Arbitrum
                </div>
              </div>

              <div
                className="flex items-start justify-between mb-12"
                style={{ paddingLeft: 64 }}
              >
                <div>
                  <div
                    className="fell italic text-sm"
                    style={{ color: "var(--oxblood)" }}
                  >
                    from the desk of
                  </div>
                  <div
                    className="hand text-3xl"
                    style={{ color: "var(--seal-blue)" }}
                  >
                    the Vidix Correspondent
                  </div>
                  <div
                    className="typewriter text-[10px] tracking-[0.2em] mt-2"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    NO. 001 &nbsp;·&nbsp; SPRING &nbsp;·&nbsp; TWO THOUSAND AND TWENTY-SIX
                  </div>
                </div>
              </div>

              <div style={{ paddingLeft: 64 }}>
                <div
                  className="fell italic text-2xl mb-6"
                  style={{ color: "var(--ink)" }}
                >
                  Dear Bearer,—
                </div>

                <h1
                  className="fell leading-[0.95] mb-8"
                  style={{ fontSize: 82, color: "var(--ink)" }}
                >
                  <span>We keep</span>
                  <br />
                  <span>
                    your <em style={{ color: "var(--oxblood)" }}>secret</em>
                  </span>
                  <br />
                  <span>on your behalf.</span>
                </h1>

                <div
                  className="serif text-xl leading-relaxed mb-6"
                  style={{ color: "var(--ink-soft)", maxWidth: "44ch" }}
                >
                  Your creditworthiness is a private matter. We have long held
                  this to be self-evident. And yet the credit bureaus of the old
                  world keep your number in a ledger anyone can read, and the
                  lenders of the new world ask you to{" "}
                  <span className="hand-strike">post collateral twice over</span>{" "}
                  — <em>overcollateralize</em> — because they cannot trust what
                  they cannot see.
                </div>

                <div
                  className="serif text-xl leading-relaxed mb-6"
                  style={{ color: "var(--ink-soft)", maxWidth: "44ch" }}
                >
                  We propose a different arrangement. You give us your history.
                  We{" "}
                  <span className="hand-underline">
                    seal it in a cipher neither of us can open
                  </span>
                  . When a lender inquires, we compute under the seal itself
                  and return a single word:{" "}
                  <em style={{ color: "var(--oxblood)" }}>yes</em>, or{" "}
                  <em>no</em>. Never the number.
                </div>

                <div
                  className="serif text-xl leading-relaxed mb-10"
                  style={{ color: "var(--ink-soft)", maxWidth: "44ch" }}
                >
                  This is not magic. It is{" "}
                  <em
                    className="hand-circle-blue"
                    style={{ display: "inline-block" }}
                  >
                    fully homomorphic encryption
                  </em>
                  , and it has been waiting for an honest application. We
                  believe it should be you.
                </div>

                <div className="mt-12 flex items-end justify-between">
                  <div>
                    <div
                      className="fell italic"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      Yours, in confidence,
                    </div>
                    <div
                      className="script text-4xl mt-3"
                      style={{ color: "var(--seal-blue)" }}
                    >
                      the Vidix Bureau
                    </div>
                    <div
                      className="typewriter text-[10px] tracking-[0.2em] mt-2"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      ARB-SEPOLIA — CH. 421614
                    </div>
                  </div>
                  <div className="wax-seal sway">
                    <span style={{ fontSize: 30 }}>V</span>
                  </div>
                </div>
              </div>

              <div
                className="coffee-stain"
                style={{ bottom: 100, right: -40 }}
              />
            </div>
          </div>

          {/* Right: Tucked assets */}
          <div className="col-span-12 lg:col-span-4 relative">
            <div className="sticky top-8 space-y-10">
              <div className="flex items-start gap-4">
                <div className="postage">
                  <div className="text-center">
                    <div className="text-[9px] tracking-[0.2em] mb-1">
                      VIDIX · II
                    </div>
                    <div className="text-4xl leading-none italic">V</div>
                    <div className="text-[9px] tracking-[0.2em] mt-1">
                      SEALED
                    </div>
                    <div
                      className="typewriter text-[8px] mt-2"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      ▲ HOMOMORPHIC ▲
                    </div>
                  </div>
                </div>
                <div style={{ paddingTop: 20 }}>
                  <div
                    className="hand text-2xl"
                    style={{
                      color: "var(--seal-blue)",
                      transform: "rotate(-2deg)",
                      display: "inline-block",
                    }}
                  >
                    for the private.
                  </div>
                </div>
              </div>

              <div
                className="card-aged folded-corner"
                style={{ transform: "rotate(-0.8deg)" }}
              >
                <div
                  className="typewriter text-[10px] tracking-[0.2em] mb-3"
                  style={{ color: "var(--oxblood)" }}
                >
                  BY APPOINTMENT
                </div>
                <div className="fell text-3xl leading-tight mb-4">
                  Commence your <em>correspondence.</em>
                </div>
                <p
                  className="text-[15px] mb-6"
                  style={{ color: "var(--ink-soft)" }}
                >
                  No fee is due on testnet. We will issue your passport by
                  return of post.
                </p>
                <Link
                  href="/borrow"
                  className="btn-wax w-full justify-center no-underline"
                >
                  <span>✍</span> Begin Intake
                </Link>
                <div className="stitch my-5" />
                <Link
                  href="/passport"
                  className="btn-plain w-full justify-center no-underline"
                >
                  View a Specimen Dossier
                </Link>
              </div>

              <div className="relative" style={{ paddingLeft: 20 }}>
                <div
                  className="typewriter text-[10px] tracking-[0.2em] mb-2"
                  style={{ color: "var(--ink-soft)" }}
                >
                  ALREADY ENROLLED?
                </div>
                <div className="fell italic text-lg mb-3">
                  Produce your passport at any counter. The Bureau will
                  recognize you on sight.
                </div>
                <div
                  className="stamp stamp-olive"
                  style={{ transform: "rotate(-8deg)", fontSize: 11 }}
                >
                  Soulbound · ERC-5192
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motto row */}
        <div className="mt-20 relative">
          <div className="double-rule my-8" />
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 text-center">
            <span
              className="fell italic text-2xl"
              style={{ color: "var(--ink-soft)" }}
            >
              Private by construction
            </span>
            <span className="hand text-3xl" style={{ color: "var(--oxblood)" }}>
              ※
            </span>
            <span
              className="fell italic text-2xl"
              style={{ color: "var(--ink-soft)" }}
            >
              Soulbound by standard
            </span>
            <span className="hand text-3xl" style={{ color: "var(--oxblood)" }}>
              ※
            </span>
            <span
              className="fell italic text-2xl"
              style={{ color: "var(--ink-soft)" }}
            >
              Audited by consent
            </span>
            <span className="hand text-3xl" style={{ color: "var(--oxblood)" }}>
              ※
            </span>
            <span
              className="fell italic text-2xl"
              style={{ color: "var(--ink-soft)" }}
            >
              Composable by design
            </span>
          </div>
          <div className="double-rule my-8" />
        </div>
      </div>

      {/* ==================== THE LEDGER (Numbers) ==================== */}
      <div className="max-w-col mx-auto px-8 py-20">
        <div className="grid grid-cols-12 gap-10 items-start">
          <div className="col-span-12 lg:col-span-4">
            <div
              className="typewriter text-[11px] tracking-[0.3em] mb-3"
              style={{ color: "var(--oxblood)" }}
            >
              § THE LEDGER
            </div>
            <h2 className="fell text-6xl leading-[0.9] mb-6">
              As counted
              <br />
              <em>this morning.</em>
            </h2>
            <p
              className="serif text-lg italic leading-relaxed"
              style={{ color: "var(--ink-soft)" }}
            >
              Sampled at block 8,247,193. We count what can be counted; the
              rest, by its nature, cannot be.
            </p>

            <div
              className="mt-10 hand text-2xl"
              style={{
                color: "var(--seal-blue)",
                transform: "rotate(-1deg)",
              }}
            >
              — from the morning&apos;s tally
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-2 gap-6">
              <LedgerFigure
                label="FIG. 01"
                title="passports issued"
                value="12,847"
                note="+312 THIS WEEK"
                hand="↑ growing"
              />
              <LedgerFigure
                label="FIG. 02"
                title="sum lent, under-collateralized"
                value={
                  <>
                    $4.2<span style={{ color: "var(--oxblood)" }}>M</span>
                  </>
                }
                note="+840K THIS WEEK"
                hand="↑ climbing"
              />
              <LedgerFigure
                label="FIG. 03"
                title="mean credit score"
                value={
                  <span className="redact-block" style={{ fontSize: 60 }}>
                    ▓▓▓
                  </span>
                }
                note="SEALED UNDER FHE"
                stamp="CLASSIFIED"
              />
              <LedgerFigure
                label="FIG. 04"
                title="counting-houses, in correspondence"
                value="24"
                note="+6 THIS QUARTER"
                hand="↑ steady"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PROCEDURE IN THREE ACTS ==================== */}
      <div
        className="relative"
        style={{
          background: "var(--paper-2)",
          borderTop: "1px solid var(--crease-strong)",
          borderBottom: "1px solid var(--crease-strong)",
        }}
      >
        <div className="max-w-col mx-auto px-8 py-24">
          <div className="mb-16 relative">
            <div
              className="typewriter text-[11px] tracking-[0.3em] mb-3"
              style={{ color: "var(--oxblood)" }}
            >
              § THE PROCEDURE &nbsp;·&nbsp; IN THREE ACTS
            </div>
            <h2 className="fell text-6xl md:text-7xl leading-[0.9] max-w-4xl">
              Our method,
              <br />
              <em>made plain.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActCard
              number="I."
              title="Act the First"
              subtitle="The Whisper."
              body="You tell us your particulars — history, utilization, cadence of repayment — in the privacy of your own browser. The figures are sealed in your possession before they ever pass our threshold."
              code={`Encryptable.uint32(75n)\n→ InEuint32 {\n  ctHash: 0x9f3a7e8b...\n  proof:  0xab71...b21e\n}`}
              stampLabel="Sealed in Transit"
              stampColor="oxblood"
              rotate="-0.6deg"
              tapeLeft
            />
            <ActCard
              number="II."
              title="Act the Second"
              subtitle="The Cipher-Work."
              body="Our coprocessor performs the arithmetic upon your cipher without ever opening it. Additions, multiplications, weighted sums — all computed through the veil. The result is another cipher."
              code={`FHE.add(\n  FHE.mul(payEnc, 4),\n  FHE.mul(volEnc, 2)\n) → euint64 @ 0x..a47d`}
              stampLabel="Computed Behind Glass"
              stampColor="blue"
              rotate="0.4deg"
              tapeRight
            />
            <ActCard
              number="III."
              title="Act the Third"
              subtitle="The Verdict."
              body="A lender sets her own threshold, also sealed. We compare cipher to cipher and return a single boolean in the clear: qualified, or not. The score itself remains, as always, your property."
              code={`FHE.gte(score, threshold)\n→ ebool qualified\n↳ APPROVED · 0.52 LTV`}
              stampLabel="Yea or Nay · Nothing More"
              stampColor="olive"
              rotate="-0.3deg"
              tapeCenter
            />
          </div>

          <div className="mt-16 grid grid-cols-12 gap-8 items-start">
            <div className="col-span-1 md:col-span-1">
              <div
                className="fell italic text-7xl"
                style={{ color: "var(--oxblood)", lineHeight: 0.6 }}
              >
                *
              </div>
            </div>
            <div className="col-span-11 md:col-span-10">
              <p
                className="serif text-2xl font-light leading-snug max-w-4xl italic"
                style={{ color: "var(--ink-soft)" }}
              >
                A scholarly note. This is not zero-knowledge in the classical
                sense. It is{" "}
                <em>computation behind a veil neither party can lift</em> —
                only the coprocessor&apos;s threshold signatures can bless a result
                into plaintext, and only upon your consent.
              </p>
              <div
                className="typewriter text-[10px] mt-4 tracking-[0.2em]"
                style={{ color: "var(--oxblood)" }}
              >
                — TECHNICAL ADDENDUM, § 3.4
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== POSTCARDS FROM THE FIELD ==================== */}
      <div
        style={{
          background: "var(--paper-2)",
          borderTop: "1px solid var(--crease-strong)",
          borderBottom: "1px solid var(--crease-strong)",
        }}
      >
        <div className="max-w-col mx-auto px-8 py-24">
          <div className="mb-16">
            <div
              className="typewriter text-[11px] tracking-[0.3em] mb-3"
              style={{ color: "var(--oxblood)" }}
            >
              § POSTCARDS FROM THE FIELD
            </div>
            <h2 className="fell text-6xl leading-[0.9]">
              What bearers
              <br />
              <em>are saying.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Postcard
              quote="Applied for a short-term line against my freelance income. Helix approved me at 8% — my bank wouldn&apos;t touch the application without a pay-stub. The Bureau knew better."
              who="0x7a...9e1b"
              role="BEARER · NO. 00421"
              stampLabel="Approved"
              stampColor="oxblood"
              rotate="-1.5deg"
              tapeLeft
            />
            <Postcard
              quote="I underwrite for a pool that could never publish borrower histories on-chain. Vidix lets us price risk without violating anyone&apos;s privacy. Frankly, it feels like cheating."
              who="Helix Pool"
              role="COUNTING-HOUSE · 0xA71c"
              stampLabel="Consumer"
              stampColor="blue"
              rotate="1.2deg"
              tapeRight
            />
            <Postcard
              quote="Our jurisdiction required an on-chain compliance attestation. The Vidix range-prover gave our regulator a yes-or-no answer about every borrower. No ledger to leak. No journalist to subpoena."
              who="Silent·DAO"
              role="INSPECTOR · 0xD91e"
              stampLabel="Attested"
              stampColor="olive"
              rotate="-0.8deg"
              tapeCenter
            />
          </div>
        </div>
      </div>

      {/* ==================== FAQ ==================== */}
      <div className="max-w-col mx-auto px-8 py-24">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-4">
            <div
              className="typewriter text-[11px] tracking-[0.3em] mb-3"
              style={{ color: "var(--oxblood)" }}
            >
              § FROM THE SUGGESTION-BOX
            </div>
            <h2 className="fell text-6xl leading-[0.9] mb-6">
              Questions, <em>received.</em>
            </h2>
            <p
              className="serif text-lg italic"
              style={{ color: "var(--ink-soft)" }}
            >
              The Bureau replies to the honest ones. Here are the replies we&apos;ve
              filed for publication.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="space-y-6">
              <Faq
                open
                q="Q. How does Vidix differ from a zero-knowledge credit score?"
                a="A zero-knowledge proof attests to a statement about a private value you already know. Fully homomorphic encryption lets someone else compute new things about a value they have never seen. Vidix uses the latter. The scoring arithmetic runs on ciphertext — even the Bureau could not disclose a score, because the plaintext has never existed anywhere we could reach."
                rotate="-0.2deg"
              />
              <Faq
                q="Q. What if my wallet is stolen?"
                a="Your passport is soulbound — it cannot be transferred. The thief cannot sell your reputation. They can, in principle, attempt to borrow against it, and so recovery proceeds through our guardian route: revoke consumer permissions, re-issue under a new key."
                rotate="0.3deg"
              />
              <Faq
                q="Q. Can a lender coerce me into revealing my score?"
                a="Coercion is a social problem and cryptography cannot solve it. What we promise: no protocol built upon the Vidix primitive has any technical means to learn the plaintext. What you choose to unseal for yourself — to show a friend, a spouse, a lender over a long dinner — is, as it should be, your own business."
                rotate="-0.3deg"
              />
              <Faq
                q="Q. Is the plaintext ever stored anywhere?"
                a="Only transiently, in your own browser, after you have issued yourself a permit. Never on-chain. Never in our servers. Never in a lender&apos;s contract. The coprocessor sees only cipher-handles and threshold-signs results into being. The plaintext lives exactly where you let it, and nowhere else."
                rotate="0.2deg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ==================== FINAL CTA ==================== */}
      <div
        className="relative py-32"
        style={{
          background: "var(--paper-3)",
          borderTop: "1px solid var(--crease-strong)",
        }}
      >
        <div className="max-w-col mx-auto px-8">
          <div
            className="letter max-w-3xl mx-auto text-center"
            style={{ padding: "80px 60px" }}
          >
            <div
              className="typewriter text-[11px] tracking-[0.3em] mb-6"
              style={{ color: "var(--oxblood)" }}
            >
              § AN INVITATION
            </div>
            <h2 className="fell text-7xl leading-[0.9] mb-8">
              Seal your <em>cipher.</em>
              <br />
              Publish your <em>consent.</em>
            </h2>
            <p
              className="serif text-xl italic leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: "var(--ink-soft)" }}
            >
              A passport is issued in under thirty seconds. It costs nothing on
              the testnet. And the Bureau, bless it, is{" "}
              <em>open for the day.</em>
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
              <Link href="/borrow" className="btn-wax no-underline">
                ✍ Begin Your Intake
              </Link>
              <button className="btn-plain">Read the White-Paper</button>
            </div>

            <div className="mt-12 flex justify-center items-center gap-8">
              <div
                className="script text-4xl"
                style={{ color: "var(--seal-blue)" }}
              >
                the Bureau
              </div>
              <div
                className="wax-seal"
                style={{ width: 60, height: 60, fontSize: 22 }}
              >
                V
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ==================== helpers ==================== */

function LedgerFigure({
  label,
  title,
  value,
  note,
  hand,
  stamp,
}: {
  label: string;
  title: string;
  value: React.ReactNode;
  note: string;
  hand?: string;
  stamp?: string;
}) {
  return (
    <div className="card-plain">
      <div className="flex justify-between items-start mb-4">
        <span
          className="typewriter text-[10px] tracking-[0.2em]"
          style={{ color: "var(--oxblood)" }}
        >
          {label}
        </span>
        {hand ? (
          <span
            className="hand text-xl"
            style={{ color: "var(--seal-blue)" }}
          >
            {hand}
          </span>
        ) : stamp ? (
          <span
            className="stamp stamp-oxblood"
            style={{ fontSize: 8, padding: "2px 6px" }}
          >
            {stamp}
          </span>
        ) : null}
      </div>
      <div
        className="fell italic text-sm mb-2"
        style={{ color: "var(--ink-soft)" }}
      >
        {title}
      </div>
      <div className="fell text-7xl leading-none">{value}</div>
      <div
        className="typewriter text-[10px] mt-3"
        style={{ color: "var(--ink-soft)" }}
      >
        {note}
      </div>
    </div>
  );
}

function ActCard({
  number,
  title,
  subtitle,
  body,
  code,
  stampLabel,
  stampColor,
  rotate,
  tapeLeft,
  tapeRight,
  tapeCenter,
}: {
  number: string;
  title: string;
  subtitle: string;
  body: string;
  code: string;
  stampLabel: string;
  stampColor: "oxblood" | "blue" | "olive";
  rotate: string;
  tapeLeft?: boolean;
  tapeRight?: boolean;
  tapeCenter?: boolean;
}) {
  return (
    <div
      className="card-plain relative"
      style={{ background: "var(--paper-3)", transform: `rotate(${rotate})` }}
    >
      {tapeLeft && (
        <div
          className="tape"
          style={{
            top: -12,
            left: 30,
            width: 70,
            transform: "rotate(-8deg)",
          }}
        />
      )}
      {tapeRight && (
        <div
          className="tape"
          style={{ top: -12, right: 40, width: 70, transform: "rotate(6deg)" }}
        />
      )}
      {tapeCenter && (
        <div
          className="tape"
          style={{
            top: -12,
            left: "50%",
            transform: "translateX(-50%) rotate(-2deg)",
            width: 70,
          }}
        />
      )}
      <div className="flex justify-between items-baseline mb-6">
        <div className="fell italic text-2xl" style={{ color: "var(--oxblood)" }}>
          {title}
        </div>
        <div
          className="typewriter text-[10px] tracking-[0.2em]"
          style={{ color: "var(--ink-soft)" }}
        >
          {number}
        </div>
      </div>
      <div className="fell text-3xl leading-tight mb-4">
        <em>{subtitle}</em>
      </div>
      <p
        className="serif text-base leading-relaxed mb-6"
        style={{ color: "var(--ink-soft)" }}
      >
        {body}
      </p>
      <div className="stitch my-4" />
      <pre
        className="courier text-[11px] leading-relaxed whitespace-pre-wrap"
        style={{ color: "var(--oxblood-dark)" }}
      >
        {code}
      </pre>
      <div className="mt-5 flex justify-end">
        <div
          className={`stamp stamp-${stampColor}`}
          style={{ fontSize: 10 }}
        >
          {stampLabel}
        </div>
      </div>
    </div>
  );
}

function Postcard({
  quote,
  who,
  role,
  stampLabel,
  stampColor,
  rotate,
  tapeLeft,
  tapeRight,
  tapeCenter,
}: {
  quote: string;
  who: string;
  role: string;
  stampLabel: string;
  stampColor: "oxblood" | "blue" | "olive";
  rotate: string;
  tapeLeft?: boolean;
  tapeRight?: boolean;
  tapeCenter?: boolean;
}) {
  return (
    <div
      className="card-plain relative"
      style={{
        background: "var(--paper-3)",
        transform: `rotate(${rotate})`,
        minHeight: 260,
      }}
    >
      {tapeLeft && (
        <div
          className="tape"
          style={{
            top: -14,
            left: 20,
            width: 60,
            transform: "rotate(-12deg)",
          }}
        />
      )}
      {tapeRight && (
        <div
          className="tape"
          style={{ top: -14, right: 30, width: 60, transform: "rotate(10deg)" }}
        />
      )}
      {tapeCenter && (
        <div
          className="tape"
          style={{
            top: -14,
            left: "50%",
            width: 60,
            transform: "translateX(-50%) rotate(2deg)",
          }}
        />
      )}

      <div
        className="fell italic text-[15px] leading-relaxed mb-4"
        style={{ color: "var(--ink)" }}
      >
        &quot;{quote}&quot;
      </div>

      <div className="flex justify-between items-end mt-6">
        <div>
          <div className="script text-xl" style={{ color: "var(--seal-blue)" }}>
            {who}
          </div>
          <div
            className="typewriter text-[9px] tracking-[0.2em] mt-1"
            style={{ color: "var(--ink-soft)" }}
          >
            {role}
          </div>
        </div>
        <div className={`stamp stamp-${stampColor}`} style={{ fontSize: 9 }}>
          {stampLabel}
        </div>
      </div>
    </div>
  );
}

function Faq({
  q,
  a,
  rotate,
  open,
}: {
  q: string;
  a: string;
  rotate: string;
  open?: boolean;
}) {
  return (
    <details
      className="card-plain"
      open={open}
      style={{ background: "var(--paper-3)", transform: `rotate(${rotate})` }}
    >
      <summary className="cursor-pointer list-none flex justify-between items-start gap-4">
        <span className="fell italic text-2xl leading-snug">{q}</span>
        <span className="fell italic text-3xl" style={{ color: "var(--oxblood)" }}>
          ›
        </span>
      </summary>
      <div
        className="mt-4 pt-4"
        style={{ borderTop: "1px dotted var(--crease-strong)" }}
      >
        <p
          className="serif text-lg leading-relaxed"
          style={{ color: "var(--ink-soft)" }}
        >
          {a}
        </p>
      </div>
    </details>
  );
}
