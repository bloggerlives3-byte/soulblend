import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          900: "#1c1024",
          700: "#3b1b4f",
          500: "#6b2d7b",
          300: "#a45abf"
        },
        gold: {
          500: "#f5c876",
          300: "#ffe4a3"
        },
        vinyl: {
          900: "#0d0b11",
          700: "#16141c"
        }
      }
    }
  },
  plugins: []
};

export default config;
