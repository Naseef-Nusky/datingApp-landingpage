/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'vantage-purple': '#5A2D8A',
        'vantage-pink': '#B5458F',
        'vantage-coral': '#E97672'
      }
    }
  },
  plugins: []
};

