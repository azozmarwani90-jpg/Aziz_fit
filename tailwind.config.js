/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#145231',
        },
        teal: {
          DEFAULT: '#14B8A6',
          dark: '#0D9488',
          light: '#CCFBF1',
        },
        mint: {
          DEFAULT: '#A7F3D0',
          light: '#D1FAE5',
          dark: '#6EE7B7',
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
        'gradient-secondary': 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(16, 185, 129, 0.2)',
        'gold': '0 8px 24px rgba(245, 158, 11, 0.3)',
        'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        safe: '1rem',
      },
      fontSize: {
        'base-arabic': '1rem',
      },
    },
  },
  plugins: [],
}

