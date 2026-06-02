/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gp: {
          bg:       '#080810',
          surface:  '#0f0f1e',
          card:     '#13132a',
          border:   '#1e1e3f',
          accent:   '#7c6aff',
          'accent-dim': '#4a3fbf',
          cyan:     '#00e5c8',
          danger:   '#ff4560',
          warning:  '#ffa500',
          text:     '#c8cfe8',
          muted:    '#5a6080',
        },
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan-line':  'scanLine 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px #7c6aff44' },
          '50%':      { boxShadow: '0 0 24px #7c6affaa' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(124,106,255,0.04) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(124,106,255,0.04) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
