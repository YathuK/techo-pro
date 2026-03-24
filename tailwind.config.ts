import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#2d2d2d",
          950: "#1a1a1a",
        },
        cream: {
          50: "#fefdfb",
          100: "#fdf9f0",
          200: "#f5f0e8",
          300: "#ede4d3",
          400: "#e0d0b5",
          500: "#d4bc97",
          600: "#c2a070",
          700: "#a8845a",
          800: "#8b6d4a",
          900: "#735b3f",
        },
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
        accent: {
          DEFAULT: "#D4A574",
          light: "#E8C9A8",
          dark: "#B8864E",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
