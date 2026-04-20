import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#0E2A2E",
        "paper-2": "#153538",
        "paper-3": "#1C4044",
        "paper-dark": "#0A1F22",
        ink: "#F4C9A0",
        "ink-soft": "#E6AE82",
        oxblood: "#FF8A5B",
        "oxblood-dark": "#D96A3A",
        wax: "#E85A2C",
        "seal-blue": "#A8D5B0",
        "seal-blue-dark": "#6FA578",
        pencil: "#B89A7A",
        olive: "#C9A961",
        stamp: "#FF8A5B",
        "rose-bone": "#E8C5B0",
        redact: "#050F11",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        fell: ["'IM Fell English'", "serif"],
        typewriter: ["'Special Elite'", "cursive"],
        courier: ["'Courier Prime'", "monospace"],
        hand: ["'Caveat'", "cursive"],
        script: ["'Homemade Apple'", "cursive"],
      },
      maxWidth: {
        col: "1280px",
      },
      borderRadius: {
        DEFAULT: "0px",
      },
    },
  },
  plugins: [],
};
export default config;
