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
        primary: {
          50: '#f4f7fb',
          100: '#e8eef6',
          200: '#cbdbe9',
          300: '#9ebdcf',
          400: '#6999b1',
          500: '#487d97',
          600: '#37647d',
          700: '#2e5166',
          800: '#284555',
          900: '#253b49',
          950: '#15242f',
        },
        accent: {
          50: '#eefbfa',
          100: '#d2f6f2',
          200: '#a7ebe4',
          300: '#72dace',
          400: '#48c0b5',
          500: '#2ea399',
          600: '#22837b',
          700: '#1f6964',
          800: '#1d5451',
          900: '#1c4745',
          950: '#0b2a29',
        },
        dark: {
          50: '#f6f6f7',
          100: '#eef0f2',
          200: '#d9dde3',
          300: '#b7bfc9',
          400: '#8f9bb0',
          500: '#707e99',
          600: '#596781',
          700: '#49536a',
          800: '#3f4757',
          900: '#111827',
          950: '#030712',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
