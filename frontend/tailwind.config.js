/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#03001e',
          deep: '#0a0026',
          purple: 'var(--cyber-purple, #7f00ff)',
          pink: 'var(--cyber-pink, #e100ff)',
          cyan: '#00f2fe',
          blue: '#4facfe',
          glass: 'rgba(10, 5, 30, 0.55)',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'var(--color-glow-purple-light, rgba(127, 0, 255, 0.15))',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 15px rgba(0, 242, 254, 0.4)',
        'glow-purple': '0 0 15px var(--color-glow-purple, rgba(127, 0, 255, 0.4))',
      },
      backdropFilter: {
        'glass': 'blur(12px)',
      }
    },
  },
  plugins: [],
}
