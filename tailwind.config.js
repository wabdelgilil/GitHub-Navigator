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
        github: {
          dark: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          accent: '#238636',
          blue: '#58a6ff',
          muted: '#8b949e',
          lightText: '#c9d1d9'
        }
      }
    },
  },
  plugins: [],
}
