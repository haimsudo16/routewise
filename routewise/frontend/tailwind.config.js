/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        base: {
          950: '#050810',
          900: '#0a0e18',
          850: '#0d1220',
          800: '#111828',
          700: '#1a2236',
          600: '#28324a',
        },
        accent: {
          DEFAULT: '#3ddcf7',
          dim: '#1fb8d4',
          glow: '#7ef4ff',
        },
        success: '#34d399',
        warning: '#fbbf24',
        danger: '#f87171',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(circle at center, rgba(61,220,247,0.15), transparent 70%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(61,220,247,0.15)',
        'glow-sm': '0 0 20px rgba(61,220,247,0.12)',
        card: '0 8px 30px rgba(0,0,0,0.35)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
