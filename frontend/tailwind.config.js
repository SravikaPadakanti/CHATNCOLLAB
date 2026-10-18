/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        milk: {
          DEFAULT: '#fdfdf1',
          50: '#fffff8',
          100: '#fdfdf1',
          200: '#f7f7e2',
          300: '#eeeecf',
          400: '#dedeb4',
          500: '#c5c593',
          border: '#e7e5d8',
          card: '#ffffff',
          subtle: '#f5f5e8',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        }
      }
    },
  },
  plugins: [],
}