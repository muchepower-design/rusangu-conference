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
        sda: {
          blue: '#0054A4',
          'blue-dark': '#003366',
          'blue-light': '#00A3E0',
          gold: '#F2B827',
          white: '#FFFFFF',
          'gray-light': '#F5F5F5',
        },
      },
      ringColor: {
        'sda-blue-light': '#00A3E0',
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1541972973184-1f0edf5f5e6b?w=1200&q=80')",
        'hero-pattern-dark': "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80')",
      },
    },
  },
  plugins: [],
}