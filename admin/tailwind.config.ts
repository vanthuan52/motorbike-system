import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "2rem",
        lg: "3rem",
        xl: "4rem",
      },
    },
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#9333ea",
        accent: "#f97316",
        muted: "#6b7280",
        background: "#f9fafb",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif"],
      },
      animation: {
        fade: "fadeIn 0.5s ease-in-out",
        slide: "slideIn 0.4s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideIn: {
          from: { transform: "translateY(20px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

export default config;
