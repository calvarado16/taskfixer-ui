/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0f172a',          // slate-900
          card: '#111827',        // gray-900 muy oscuro para tarjetas/headers
          border: '#334155',      // slate-700
          text: '#e5e7eb',        // slate-200
          muted: '#94a3b8',       // slate-400
          accent: '#f59e0b',      // amber-500 (botones)
          accentHover: '#fbbf24', // amber-400
        },
      },
      boxShadow: {
        brand: '0 10px 25px -5px rgba(0,0,0,.35)',
      },
    },
  },
  plugins: [],
};



