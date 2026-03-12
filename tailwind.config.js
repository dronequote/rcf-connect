/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        church: {
          dark: "#0f3d22",
          main: "#1a5632",
          light: "#2d7a4a",
          soft: "#e8f0eb",
        },
        gold: {
          DEFAULT: "#c8a84e",
          light: "#f5f0e0",
        },
        warm: "#faf8f5",
      },
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
