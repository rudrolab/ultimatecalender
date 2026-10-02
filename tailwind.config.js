/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090a0f',
        panel: '#12141c',
        accentRed: '#ff3344',
        accentGlow: 'rgba(255, 51, 68, 0.4)',
        dotCompleted: '#e2e8f0',
        dotFuture: '#1c1f2b',
        dotCurrent: '#ff3344',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        tech: ['"Chakra Petch"', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
