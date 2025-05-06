import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: false, // or 'media'
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        nosifer: ["var(--font-nosifer)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
