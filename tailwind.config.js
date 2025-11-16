/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: ['success-snackbar', 'error-snackbar', 'info-snackbar'],
}

