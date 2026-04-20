import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Vidix — Correspondence No. 421",
  description:
    "Vidix — Bureau of Encrypted Correspondence. A confidential credit passport sealed under Fhenix CoFHE, posted on Arbitrum.",
  openGraph: {
    title: "Vidix — Bureau of Encrypted Correspondence",
    description:
      "Credit, computed on ciphertext. Kept by hand. Sealed by cipher.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Special+Elite&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=IM+Fell+English:ital@0;1&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Homemade+Apple&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* SVG filter defs for roughened stamps */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <defs>
            <filter id="roughen">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves={2}
                seed={3}
              />
              <feDisplacementMap in="SourceGraphic" scale={1.8} />
            </filter>
          </defs>
        </svg>

        <Providers>
          <TopNav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
