/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      colors: {
        neutral: "#F6F6F6",
        primary: "#00BFC5",
        "primary-dark": "#009CA2",
        accent: "#FFB703",
        dark: "#333333",
        "dark-light": "#666666",
      }
    },
  },
  plugins: [],
  safelist: ['success-snackbar', 'error-snackbar', 'info-snackbar'],
}
