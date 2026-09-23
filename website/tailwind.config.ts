import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        gold: {
          DEFAULT: '#c9a227',
          light: '#e8d48b',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.2em',
        label: '0.3em',
      },
      maxWidth: {
        content: '90rem',
        section: '80rem',
      },
    },
  },
  plugins: [],
} satisfies Config
