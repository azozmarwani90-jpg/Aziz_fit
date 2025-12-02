/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: '#10B981',
          50: '#D1FAE5',
          100: '#A7F3D0',
          200: '#6EE7B7',
          300: '#34D399',
          400: '#10B981',
          500: '#059669',
          600: '#047857',
          700: '#065F46',
          800: '#064E3B',
          900: '#022C22',
        },
        teal: {
          DEFAULT: '#14B8A6',
          dark: '#0D9488',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          accent: '#FBBF24',
        },
        luxury: {
          black: '#1A1A1A',
          gray: '#F5F5F5',
          pearl: '#FAFAFA',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(16, 185, 129, 0.2)',
        'gold': '0 8px 24px rgba(245, 158, 11, 0.3)',
      },
    },
  },
  plugins: [],
}
