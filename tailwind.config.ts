import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  plugins: [],
  theme: {
    extend: {
      animation: {
        background: 'background ease-in infinite',
        'bonce-from-bottom': 'bonce-from-bottom 0.35s ease-out',
      },
      keyframes: {
        background: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'bonce-from-bottom': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '50%': {
            opacity: '0.25',
            transform: 'translateY(-5px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
};

export default config;
