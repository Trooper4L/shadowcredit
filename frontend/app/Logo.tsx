import React from "react";

/**
 * Vidix marks — Bureau of Encrypted Correspondence identity.
 *
 * <Mark />   Apricot wax-seal glyph on dark teal paper.
 * <Logo />   <Mark /> + "Vidix" wordmark in IM Fell italic + typewriter subtitle.
 */

type MarkProps = {
  size?: number;
  className?: string;
  title?: string;
};

export function Mark({ size = 32, className, title = "Vidix mark" }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <circle cx="16" cy="16" r="13" fill="#FF8A5B" opacity="0.95" />
      <circle cx="16" cy="16" r="13" stroke="#0A1F22" strokeWidth="1" fill="none" />
      <path
        d="M 10 16 Q 16 10, 22 16 Q 16 22, 10 16 Z"
        stroke="#0E2A2E"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="16" cy="16" r="2" fill="#0E2A2E" />
    </svg>
  );
}

type LogoProps = {
  size?: number;
  subtitle?: string;
  className?: string;
};

export function Logo({
  size = 32,
  subtitle = "CORRESPONDENCE DEPT.",
  className,
}: LogoProps) {
  return (
    <div
      className={["flex items-center gap-3", className].filter(Boolean).join(" ")}
    >
      <Mark size={size} />
      <div className="leading-none">
        <div
          className="fell text-2xl italic leading-none"
          style={{ color: "var(--oxblood)" }}
        >
          Vidix
        </div>
        {subtitle ? (
          <div
            className="typewriter text-[9px] tracking-[0.25em] mt-0.5"
            style={{ color: "var(--ink-soft)" }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Logo;
