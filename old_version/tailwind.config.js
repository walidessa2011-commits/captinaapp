/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a',
          light: '#22c55e',
          dark: '#15803d',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        secondary: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['Tajawal', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        primary: '0 10px 15px rgba(22,163,74,0.3)',
        amber:   '0 10px 15px rgba(245,158,11,0.3)',
        glass:   '0 4px 30px rgba(0,0,0,0.1)',
      },
      backgroundImage: {
        'app-gradient': 'linear-gradient(to bottom right, #faf5ff, #fdf2f8, #eff6ff)',
        'hero-gradient': 'linear-gradient(to bottom right, #14532d, #15803d)',
      },
      backdropBlur: {
        xl: '24px',
      },
    },
  },
  safelist: [
    'bg-red-100', 'text-red-600', 'border-red-200',
    'bg-blue-100', 'text-blue-600', 'border-blue-200',
    'bg-purple-100', 'text-purple-600', 'border-purple-200',
    'bg-green-100', 'text-green-600', 'border-green-200',
    'bg-orange-100', 'text-orange-600', 'border-orange-200',
    'bg-yellow-100', 'text-yellow-600', 'border-yellow-200',
    'bg-indigo-100', 'text-indigo-600', 'border-indigo-200',
    'bg-pink-100', 'text-pink-600', 'border-pink-200',
    'bg-cyan-100', 'text-cyan-600', 'border-cyan-200',
  ],
  plugins: [require('tailwindcss-animate')],
};