/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        bmw: {
          blue: "#1C69D4",
          cyan: "#00D4FF",
          black: "#0a0a0a",
          silver: "#C0C0C0",
          "silver-dark": "#8A8A8A",
        },
        glass: {
          surface: "rgba(255, 255, 255, 0.03)",
          border: "rgba(255, 255, 255, 0.08)",
          highlight: "rgba(255, 255, 255, 0.15)",
          text: "rgba(255, 255, 255, 0.9)",
          muted: "rgba(255, 255, 255, 0.5)",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.2)",
        glow: "0 0 20px rgba(28, 105, 212, 0.3)",
        bmw: "0 0 30px -5px rgba(28, 105, 212, 0.15), 0 0 10px -2px rgba(0, 212, 255, 0.1)",
      },
      animation: {
        blob: "blob 10s infinite",
        flash: "flash 0.5s ease-out forwards",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        flash: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
