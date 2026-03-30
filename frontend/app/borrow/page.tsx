import SubmitData from "@/components/SubmitData";
import LoanRequest from "@/components/LoanRequest";
import NetworkPulse from "@/components/NetworkPulse";
import SecureFragment from "@/components/SecureFragment";

export default function BorrowPage() {
  return (
    <>
      {/* Header Section */}
      <section className="mb-12">
        <h2 className="text-5xl font-bold font-headline tracking-tighter text-tertiary mb-2">
          Borrow - ShadowCredit
        </h2>
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-primary-fixed" />
          <p className="text-on-surface-variant font-body text-sm tracking-wide">
            Submit zero-knowledge encrypted financial metadata to the sovereign
            vault.
          </p>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Forms */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <SubmitData />
          <LoanRequest />
        </div>

        {/* Right Column: Info/Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <NetworkPulse />
          <SecureFragment />

          {/* Promo/Visual */}
          <div className="h-64 rounded-sm relative overflow-hidden grayscale contrast-125 opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="w-full h-full bg-gradient-to-br from-[#131314] via-[#1c1b1c] to-[#353436] flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-fixed/20 text-[120px]">
                lock
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-4 left-4 p-2">
              <p className="font-headline font-bold text-lg leading-tight">
                Institutional Privacy <br />
                by Default.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <footer className="mt-16 py-8 border-t border-[#353436]/30">
        <div className="flex items-start gap-4 max-w-2xl">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">
              Technical Disclosure
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              ShadowCredit utilizes{" "}
              <span className="text-tertiary">cofhejs</span> for browser-side
              Fully Homomorphic Encryption. Your raw financial data (Payment
              History, Utilization, etc.) is encrypted locally on your device
              before being transmitted to the Arbitrum Sepolia smart contracts.
              No unencrypted data is ever accessible to ShadowCredit nodes or
              third-party auditors.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
