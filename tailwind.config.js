// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Here we map your CSS variables to Tailwind utility classes
        inter: ['var(--font-inter)', ...fontFamily.sans], // 'inter' will be font-inter
        geistSans: ['var(--font-geist-sans)', ...fontFamily.sans], // 'geistSans' will be font-geist-sans
        geistMono: ['var(--font-geist-mono)', ...fontFamily.mono], // 'geistMono' will be font-geist-mono
      },
    },
  },
  plugins: [],
}