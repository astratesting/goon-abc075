import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          brand: "#6DB5D2",
          light: "#a8d4e8",
        },
        mint: {
          brand: "#A5D8C1",
          light: "#c8e8d8",
        },
        sand: {
          brand: "#E8CDA0",
          light: "#f2e2c8",
        },
        softwhite: "#F5F8FA",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        serif: ["Lora", "Georgia", "ui-serif", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "orbit-slow": "orbit 20s linear infinite",
        "orbit-medium": "orbit 14s linear infinite reverse",
        "orbit-fast": "orbit 8s linear infinite",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
      },
      keyframes: {
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(var(--orbit-radius, 120px)) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(var(--orbit-radius, 120px)) rotate(-360deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
