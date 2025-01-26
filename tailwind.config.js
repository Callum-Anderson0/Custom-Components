/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  safelist: [
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-blue-500', // already working
  ],
  theme: {
    extend: {},
    
  },
  plugins: [],
}

