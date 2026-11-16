/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['Fredoka', 'system-ui', 'sans-serif'],
      },
      colors: {
        sky: {
          light: '#70D6FF',
          DEFAULT: '#38B6FF',
          dark: '#0090E7',
        },
        arcade: {
          pink: '#FF4D80',
          yellow: '#FFD23F',
          green: '#2EC4B6',
          orange: '#FF6B35',
          purple: '#9B5DE5',
          blue: '#00BBF9',
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 2.5s infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
