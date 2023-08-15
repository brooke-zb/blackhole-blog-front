import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        info: colors.cyan,
        success: colors.green,
        danger: colors.rose,
        warning: colors.amber,
        dark: colors.slate,
        light: colors.neutral,
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
