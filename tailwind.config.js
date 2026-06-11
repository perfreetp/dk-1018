/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB7C5',
        secondary: '#FFF5E6',
        accent: '#FFD93D',
        background: '#FFF8F0',
        surface: '#FFFFFF',
        text: '#5D4E37',
        'text-muted': '#8B7B6B',
        success: '#7CB87C',
        warning: '#F4A460',
        danger: '#E87676',
      },
      boxShadow: {
        soft: '0 4px 12px rgba(255, 183, 197, 0.3)',
        card: '0 8px 24px rgba(255, 183, 197, 0.2)',
      },
    },
  },
  plugins: [],
}
