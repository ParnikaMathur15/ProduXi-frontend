/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist:[
    "text-emerald-500",
    "text-lime-300",
    "text-amber-300",
    "text-amber-400",
    "text-amber-600",
    "text-orange-500",
    "text-rose-500"
  ],
  theme: {
    extend: {
      colors:{
        dark_purple:'#351c3e',
        light_purple:'#4A2A47',
        peach:'#FFB895',
        cream:'#FACAB3',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
