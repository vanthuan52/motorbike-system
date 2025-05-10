import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: false, // or 'media'
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      md: "769px", // 👈 đổi md thành 769px
    },
  },
  plugins: [],
};

export default config;
