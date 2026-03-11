/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7c3aed',
          pink: '#ec4899',
          orange: '#f97316',
          yellow: '#eab308',
          green: '#22c55e',
          blue: '#0ea5e9',
        },
      },
    },
  },
  plugins: [],
};
