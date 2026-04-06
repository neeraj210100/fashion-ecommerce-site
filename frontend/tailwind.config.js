/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1814",
        parchment: "#f6f3ee",
        sand: "#e8e2d9",
        clay: "#c4b8a8",
        wine: "#5c2d2d",
        gold: "#b08d57",
      },
      fontFamily: {
        display: ["\"Cormorant Garamond\"", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(26, 24, 20, 0.35)",
        card: "0 8px 30px -12px rgba(26, 24, 20, 0.15)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
