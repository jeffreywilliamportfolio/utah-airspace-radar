import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        soft: "rgb(var(--color-soft) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: [
          "var(--font-heading)",
          "Space Grotesk",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      borderRadius: {
        card: "var(--radius-card)"
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(148,163,184,0.18), 0 20px 45px rgba(2,6,23,0.35)",
        soft: "0 8px 24px rgba(2,6,23,0.22)"
      }
    }
  },
  plugins: []
};

export default config;
