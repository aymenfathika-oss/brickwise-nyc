import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EDE7D8",
        paperDark: "#E2DAC4",
        ink: "#1C2530",
        inkSoft: "#4A5568",
        line: "#C7BBA0",
        stamp: "#B23A2E",
        blueprint: "#2F6F8F",
        brass: "#B8901F",
        borough: {
          mn: "#B23A2E",
          bk: "#2F6F8F",
          qn: "#3F7D4E",
          bx: "#B8901F",
          si: "#6B4E71",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        grain: "radial-gradient(rgba(28,37,48,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grain: "3px 3px",
      },
    },
  },
  plugins: [],
};
export default config;
