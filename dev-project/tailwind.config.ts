import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // ✅ pour activer le dark mode via une classe
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './stores/**/*.{js,ts}',
    './middleware/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

export default config
