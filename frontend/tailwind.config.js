/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#14b8a6',
          dark: '#0f766e',
          soft: '#f0fdfa',
          light: '#5eead4',
        },
        secondary: {
          DEFAULT: '#0ea5e9',
          soft: '#f0f9ff',
        }
      }
    },
  },
  plugins: [],
}
