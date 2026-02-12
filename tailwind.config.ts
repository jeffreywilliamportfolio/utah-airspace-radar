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
        surface: "#0b1220",
        panel: "#121d32",
        accent: "#60a5fa",
        soft: "#94a3b8"
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(148,163,184,0.18), 0 20px 45px rgba(2,6,23,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
