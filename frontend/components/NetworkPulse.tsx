const ROWS: { label: string; value: string; alt?: boolean }[] = [
  { label: "Browser Encryption",   value: "cofhejs v2.1", alt: true },
  { label: "Global Liquidity",     value: "$142.8M" },
  { label: "Avg. Loan Processing", value: "~450ms", alt: true },
];

export default function NetworkPulse() {
  return (
    <div className="bg-surface-container p-6 rounded-sm border border-outline-variant/10">
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-secondary">
          Network Pulse
        </span>
        <div className="px-2 py-0.5 bg-secondary/10 text-secondary text-[8px] font-mono rounded-sm">
          FHE ACTIVE
        </div>
      </div>
      <div className="space-y-6">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className={
              "flex justify-between items-center p-3 rounded-sm" +
              (row.alt ? " bg-surface-container-low" : "")
            }
          >
            <span className="text-xs text-on-surface-variant">{row.label}</span>
            <span className="text-xs font-mono text-tertiary">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
