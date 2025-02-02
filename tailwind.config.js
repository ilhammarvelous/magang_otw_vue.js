/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container:{
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Atur Poppins sebagai default
      },
    },
  },
  plugins: [],
}
