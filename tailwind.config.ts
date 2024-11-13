import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
      fadeOut: {
        '0%': { opacity: '1', visibility: 'visible', display: 'flex' },
        '30%': { opacity: '1', visibility: 'visible', display: 'flex' },
        '99%': { opacity: '0', height: '100%', visibility: 'hidden' },
        '100%': { opacity: '0', height: '0', visibility: 'hidden' },
      },
    },
    animation: {
      fadeOut: 'fadeOut 1s ease-out',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
