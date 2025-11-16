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
      }
    },
  },
  plugins: [],
  safelist: ['success-snackbar', 'error-snackbar', 'info-snackbar'],
}
