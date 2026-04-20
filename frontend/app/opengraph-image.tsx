import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vidix — Bureau of Encrypted Correspondence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const paper = "#0E2A2E";
  const paperDark = "#0A1F22";
  const paper3 = "#1C4044";
  const ink = "#F4C9A0";
  const inkSoft = "#E6AE82";
  const oxblood = "#FF8A5B";
  const sealBlue = "#A8D5B0";
  const creaseStrong = "rgba(244, 201, 160, 0.22)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: paper,
          color: ink,
          padding: "72px 96px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 32,
            right: 32,
            bottom: 32,
            left: 32,
            border: `1px dashed ${creaseStrong}`,
            opacity: 0.6,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: inkSoft,
          }}
        >
          <span>VOL. II · BUREAU OF CORRESPONDENCE</span>
          <span style={{ color: oxblood }}>vidix.xyz</span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 56,
            marginTop: 56,
          }}
        >
          {/* Wax seal */}
          <svg width={220} height={220} viewBox="0 0 220 220">
            <defs>
              <radialGradient id="wax" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FFB98A" />
                <stop offset="40%" stopColor="#FF8A5B" />
                <stop offset="75%" stopColor="#D96A3A" />
                <stop offset="100%" stopColor="#9A3E18" />
              </radialGradient>
            </defs>
            <circle cx="110" cy="110" r="96" fill="url(#wax)" />
            <circle cx="110" cy="110" r="82" stroke="#2E120A" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <text
              x="110"
              y="140"
              textAnchor="middle"
              fontFamily="serif"
              fontStyle="italic"
              fontSize="96"
              fill="#2E120A"
            >
              V
            </text>
          </svg>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 200,
                lineHeight: 0.9,
                letterSpacing: -4,
                color: oxblood,
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              Vidix
            </div>
            <div
              style={{
                fontSize: 30,
                color: inkSoft,
                maxWidth: 720,
                lineHeight: 1.25,
                fontStyle: "italic",
              }}
            >
              Credit, computed on ciphertext. Kept by hand. Sealed by cipher.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${creaseStrong}`,
            paddingTop: 24,
            marginTop: 24,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: inkSoft,
          }}
        >
          <span>BUILT ON FHENIX CoFHE</span>
          <span style={{ color: sealBlue }}>cofhejs · threshold-signed</span>
          <span>ARBITRUM SEPOLIA</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: oxblood,
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
