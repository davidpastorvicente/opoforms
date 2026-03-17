/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.04), 0 12px 20px rgba(0,0,0,0.03)',
        'card-hover': '0 2px 4px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 20px 32px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
