/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',

        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',

        text: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      spacing: {
        section: 'var(--space-section)',
      },
    },
  },
  plugins: [],
}
