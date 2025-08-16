/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F8F5EE",
        gold: "#D4AF37",
        navy: "#0F1B2D",
        wood: "#7a5b3a",
      },
      boxShadow: {
        "card": "0 10px 25px rgba(0,0,0,0.15)",
        "soft": "0 6px 18px rgba(0,0,0,0.12)"
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
};