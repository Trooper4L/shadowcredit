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
        <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-sm">
          <span className="text-xs text-on-surface-variant">
            Browser Encryption
          </span>
          <span className="text-xs font-mono text-tertiary">cofhejs v2.1</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-sm">
          <span className="text-xs text-on-surface-variant">
            Global Liquidity
          </span>
          <span className="text-xs font-mono text-tertiary">$142.8M</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-sm">
          <span className="text-xs text-on-surface-variant">
            Avg. Loan Processing
          </span>
          <span className="text-xs font-mono text-tertiary">~450ms</span>
        </div>
      </div>
    </div>
  );
}
