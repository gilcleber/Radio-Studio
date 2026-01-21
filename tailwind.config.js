/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0f172a', // Deep Navy
          light: '#1e293b', // Lighter Navy
        },
        primary: {
          DEFAULT: '#06b6d4', // Luminous Cyan
          glow: '#22d3ee',
        },
        accent: {
          gold: '#f59e0b', // Divine Gold
          magenta: '#d946ef', // Neon Magenta
          blue: '#1e40af', // Royal Blue
        },
        surface: {
          dark: '#1e293b',
          card: 'rgba(30, 41, 59, 0.7)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'], // For Headings
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #06b6d4' },
          '100%': { boxShadow: '0 0 20px #06b6d4, 0 0 10px #22d3ee' },
        }
      }
    },
  },
  plugins: [],
}
