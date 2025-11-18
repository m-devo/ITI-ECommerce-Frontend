/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      
      colors: {
        neutral: "#F6F6F6",
        primary: "#00BFC5",
        "primary-dark": "#009CA2",
        accent: "#FFB703",
        dark: "#333333",
        "dark-light": "#666666",
      },
      
    },
  },
  plugins: [],
}

