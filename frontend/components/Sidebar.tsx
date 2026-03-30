"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/borrow", label: "Borrow", icon: "account_balance_wallet" },
  { href: "/lend", label: "Lend", icon: "payments" },
  { href: "/auditor", label: "Auditor", icon: "policy" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col w-64 border-r border-[#353436] bg-[#131314] z-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tighter text-[#CCFF00] font-headline">
          ShadowCredit
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
          The Sovereign Vault
        </p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-4 px-4 py-3 rounded-sm transition-all text-[#CCFF00] font-bold border-r-2 border-[#CCFF00] bg-gradient-to-r from-[#CCFF00]/10 to-transparent"
                  : "flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-[#353436] hover:text-[#ffffff] text-[#c4c9ac] opacity-60"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-headline tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-[#353436]/30">
        <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-sm">
          <div className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
          <span className="text-[10px] font-headline tracking-widest uppercase text-primary-fixed">
            CoFHE Coprocessor: Online
          </span>
        </div>
      </div>
    </aside>
  );
}
