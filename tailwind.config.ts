import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          200: '#fecdd3',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        surface: '#080809',
      },
      boxShadow: {
        glow: '0 20px 45px rgba(220, 38, 38, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;