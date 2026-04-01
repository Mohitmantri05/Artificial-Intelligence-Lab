/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'electric-blue': '#0070f3',
        'deep-navy': '#030014',
        'slate-soft': '#94a3b8',
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(0, 112, 243, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(138, 43, 226, 0.15) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
