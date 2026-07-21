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
        beach: {
          sky: '#DDF0FA',
          'sky-light': '#F0F8FF',
          blue: '#48A3D7',
          'blue-dark': '#236F9E',
          sand: '#FBEED2',
          'sand-light': '#FFF9EE',
          'sand-dark': '#E9D6B0',
          palm: '#80C290',
          'palm-dark': '#4F9460',
          coral: '#F6A88B',
        },
        'beach-sky': '#DDF0FA',
        'beach-sky-light': '#F0F8FF',
        'beach-blue': '#48A3D7',
        'beach-blue-dark': '#236F9E',
        'beach-sand': '#FBEED2',
        'beach-sand-light': '#FFF9EE',
        'beach-sand-dark': '#E9D6B0',
        'beach-palm': '#80C290',
        'beach-palm-dark': '#4F9460',
        'beach-coral': '#F6A88B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'beach': '0 10px 30px -10px rgba(56, 158, 215, 0.2)',
        'palm': '0 10px 30px -10px rgba(128, 194, 144, 0.25)',
        'sand': '0 10px 30px -10px rgba(233, 214, 176, 0.4)',
        'card-soft': '0 4px 20px 0 rgba(35, 111, 158, 0.08)',
      },
    },
  },
  plugins: [],
}
