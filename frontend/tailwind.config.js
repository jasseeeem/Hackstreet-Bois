/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      colors: {
        darkblue: '#24293e',
        normalblue: '#2f3855',
        lightblue: '#8ebbff',
        // white: '#ffffff'
      },
    },
  },
  plugins: [],
}
