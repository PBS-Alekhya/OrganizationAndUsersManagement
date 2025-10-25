// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Nunito Sans"', 'sans-serif'],
      },
      colors: {
        'page-bg': '#FBFDFF', // Add this
      },
    },
  },
  plugins: [],
}