/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0f3161',
        'navy-light': '#1a4a8a',
        teal: '#46a095',
        'teal-light': '#5bb8ac',
        orange: '#ffb340',
        'orange-dark': '#ffa41a',
        surface: '#f4f8fc',
        'surface-2': '#e8f0f8',
        border: '#e0e8f0',
        muted: '#6b7280',
        subtle: '#4b5563',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(15,49,97,0.06), 0 10px 30px -5px rgba(15,49,97,0.1)',
        'card-hover': '0 8px 12px -2px rgba(15,49,97,0.1), 0 20px 40px -8px rgba(15,49,97,0.15)',
        nav: '0 1px 3px rgba(15,49,97,0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f3161 0%, #1a5c8a 50%, #035d6d 100%)',
        'teal-gradient': 'linear-gradient(135deg, #46a095 0%, #035d6d 100%)',
        'surface-gradient': 'linear-gradient(180deg, #ffffff 0%, #f4f8fc 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
