import { Mark } from "@/app/Logo";

export default function Footer() {
  return (
    <footer
      className="mt-16"
      style={{
        borderTop: "2px solid var(--ink)",
        background: "var(--paper-2)",
      }}
    >
      <div className="max-w-col mx-auto px-8 py-16">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-4 mb-4">
              <Mark size={44} />
              <div>
                <div
                  className="fell text-4xl italic"
                  style={{ color: "var(--oxblood)" }}
                >
                  Vidix
                </div>
                <div
                  className="typewriter text-[9px] tracking-[0.25em] mt-1"
                  style={{ color: "var(--ink-soft)" }}
                >
                  BUREAU OF ENCRYPTED CORRESPONDENCE
                </div>
              </div>
            </div>
            <p
              className="fell italic text-lg leading-relaxed mt-6 max-w-md"
              style={{ color: "var(--ink-soft)" }}
            >
              A confidential credit passport, built upon Fhenix CoFHE, posted
              on Arbitrum. Kept by hand. Sealed by cipher.
            </p>
            <div className="mt-6 flex gap-2">
              <button className="btn-plain text-[10px] py-2 px-4">GitHub ↗</button>
              <button className="btn-plain text-[10px] py-2 px-4">Twitter ↗</button>
              <button className="btn-plain text-[10px] py-2 px-4">Discord ↗</button>
            </div>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div
              className="typewriter text-[10px] tracking-[0.2em] mb-4"
              style={{ color: "var(--oxblood)" }}
            >
              THE PROTOCOL
            </div>
            <ul className="space-y-2 fell italic">
              <li><a href="#">Passport</a></li>
              <li><a href="#">Scorer</a></li>
              <li><a href="#">Lender</a></li>
              <li><a href="#">Prover</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div
              className="typewriter text-[10px] tracking-[0.2em] mb-4"
              style={{ color: "var(--oxblood)" }}
            >
              THE DESK
            </div>
            <ul className="space-y-2 fell italic">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API</a></li>
              <li><a href="#">SDK</a></li>
              <li><a href="#">Contracts</a></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <div
              className="typewriter text-[10px] tracking-[0.2em] mb-4"
              style={{ color: "var(--oxblood)" }}
            >
              BUREAU STATUS
            </div>
            <div className="space-y-2 typewriter text-[11px]">
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Coprocessor</span>
                <span style={{ color: "var(--oxblood)" }}>● 99.97%</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>RPC</span>
                <span style={{ color: "var(--oxblood)" }}>● healthy</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Indexer</span>
                <span style={{ color: "var(--oxblood)" }}>● 6ms</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--ink-soft)" }}>Block</span>
                <span style={{ color: "var(--oxblood)" }}>8,247,193</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-wrap justify-between items-center gap-4"
          style={{ borderTop: "1px dotted var(--crease-strong)" }}
        >
          <div
            className="typewriter text-[10px] tracking-[0.15em]"
            style={{ color: "var(--ink-soft)" }}
          >
            © MMXXVI &nbsp;·&nbsp; VIDIX LABS &nbsp;·&nbsp; BUREAU OF
            CORRESPONDENCE &nbsp;·&nbsp; VOL. II
          </div>
          <div className="flex gap-6 typewriter text-[10px] tracking-[0.15em]">
            <a href="#" style={{ color: "var(--ink-soft)" }}>Terms</a>
            <a href="#" style={{ color: "var(--ink-soft)" }}>Privacy</a>
            <a href="#" style={{ color: "var(--ink-soft)" }}>Disclosures</a>
          </div>
          <div className="fell italic" style={{ color: "var(--oxblood)" }}>
            — sealed in good faith —
          </div>
        </div>
      </div>
    </footer>
  );
}
