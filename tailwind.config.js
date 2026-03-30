/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          bg:     'rgba(255,255,255,0.06)',
          hover:  'rgba(255,255,255,0.10)',
          border: 'rgba(255,255,255,0.12)',
        },
        accent: {
          violet:  '#a78bfa',
          cyan:    '#22d3ee',
          emerald: '#34d399',
          amber:   '#fbbf24',
        },
        surface: {
          deep:   '#060a14',
          base:   '#0d1526',
          raised: '#121f38',
        },
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0,0,0,0.36)',
        glow:  '0 0 20px rgba(167,139,250,0.25)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%':      { transform: 'translateX(-4px)' },
          '75%':      { transform: 'translateX(4px)' },
        },
      },
      animation: {
        shake: 'shake 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
