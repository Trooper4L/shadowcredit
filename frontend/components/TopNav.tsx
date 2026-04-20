"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Logo } from "@/app/Logo";

const NAV = [
  { href: "/",         label: "Front Office" },
  { href: "/borrow",   label: "Intake" },
  { href: "/passport", label: "Your Dossier" },
  { href: "/lend",     label: "The Counting-House" },
  { href: "/auditor",  label: "The Inspector" },
];

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}\u2026${addr.slice(-4)}`;
}

export default function TopNav() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const injected = connectors.find((c) => c.id === "injected");
    if (injected) connect({ connector: injected });
  };

  return (
    <div className="envelope-nav">
      <div className="max-w-col mx-auto px-8 py-3 flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="no-underline">
            <Logo />
          </Link>
          <div
            className="hidden md:flex items-center gap-2 typewriter text-[10px] tracking-[0.2em]"
            style={{ color: "var(--ink-soft)" }}
          >
            <span className="live-dot" />
            <span>BUREAU OPEN &nbsp;·&nbsp; ARB-SEPOLIA</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => {
            const active =
              n.href === "/"
                ? pathname === "/"
                : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`nav-link no-underline ${active ? "active" : ""}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span
            className="typewriter text-[10px] tracking-[0.15em] hidden md:inline"
            style={{ color: "var(--ink-soft)" }}
          >
            BLOCK
          </span>
          <span
            className="courier text-xs"
            style={{ color: "var(--oxblood)" }}
          >
            8,247,193
          </span>
          {isConnected ? (
            <button
              onClick={() => disconnect()}
              className="btn-wax text-[11px] py-2 px-4"
            >
              {truncateAddress(address!)}
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="btn-wax text-[11px] py-2 px-4"
            >
              Present Credentials
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
