import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#2563EB",
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#1e3163",
        },
        // Neutrals (light theme)
        surface: {
          base: "#F8F9FB",
          white: "#FFFFFF",
          muted: "#F1F3F5",
          card: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E5E7EB",
          muted: "#F3F4F6",
          strong: "#D1D5DB",
        },
        text: {
          primary: "#111318",
          secondary: "#6B7280",
          muted: "#9CA3AF",
          inverse: "#FFFFFF",
        },
        // Status
        status: {
          ontime: "#16A34A",
          delayed: "#D97706",
          early: "#2563EB",
          halted: "#6B7280",
          completed: "#7C3AED",
          unknown: "#9CA3AF",
        },
        // Dark theme overrides
        dark: {
          base: "#0E1117",
          surface: "#161B27",
          card: "#1C2333",
          border: "#2D3748",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "display": ["2.75rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-page": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" }],
        "heading-section": ["1.375rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-card": ["1.0625rem", { lineHeight: "1.4", letterSpacing: "-0.005em", fontWeight: "600" }],
      },
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        "sm": "8px",
        "md": "12px",
        "lg": "16px",
        "xl": "20px",
        "2xl": "24px",
        "pill": "9999px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
        "map-control": "0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
        "modal": "0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)",
      },
      animation: {
        "shimmer": "shimmer 1.6s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "slide-up": "slide-up 0.25s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "progress": "progress 1s ease-out",
        "train-pulse": "train-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.7" },
        },
        "slide-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        "train-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 99, 235, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(37, 99, 235, 0)" },
        },
      },
      transitionDuration: {
        "micro": "150ms",
        "standard": "250ms",
        "large": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
