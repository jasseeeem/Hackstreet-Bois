/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        darkblue: "#24293e",
        normalblue: "#2f3855",
        lightblue: "#8ebbff",
        darkestblue: "#160b2b",
        white: "#ffffff",
      },
      keyframes: {
        goup: {
          "0%": {
            transform: "translateY(0px)",
          },
          "100%": {
            transform: "translateY(-180px)",
          },
        },
        godown: {
          "0%": {
            transform: "translateY(0px)",
          },
          "100%": {
            transform: "translateY(40px)",
          },
        },
        appear: {
          "0%": {
            opacity: 0.0,
          },
          "100%": {
            opacity: 1.0,
          },
        },
      },
      animation: {
        goup: "goup 0.5s ease-in-out forwards",
        godown: "godown 0.5s ease-in-out forwards",
        appear: "appear 1s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
