/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          300: colors.emerald[300],
          400: colors.emerald[400],
          500: colors.emerald[500],
          600: colors.emerald[600],
          DEFAULT: colors.emerald[400],
          hover: colors.emerald[300],
        },
        secondary: {
          300: colors.gray[300],
          400: colors.gray[400],
          500: colors.gray[500],
          DEFAULT: colors.gray[300],
          hover: colors.gray[400],
        },
        dark: {
          600: colors.gray[600],
          700: colors.gray[700],
          800: colors.gray[800],
          900: colors.gray[900],
          DEFAULT: colors.gray[700],
          hover: colors.gray[600],
        },
        error: {
          500: colors.red[500],
          600: colors.red[600],
          DEFAULT: colors.red[600],
          hover: colors.red[500],
        },
      },
      container: {
        padding: {
          DEFAULT: '1rem',
        },
        center: true,
      },
    },
  },
  plugins: [],
}
