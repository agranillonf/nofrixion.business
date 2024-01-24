/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../packages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'main-grey': '#F6F8F9',
        'default-text': '#00264D',
        'grey-text': '#73808C',
        'grey-text-hover': '#0F3357',
        'control-grey': '#8F99A3',
        'control-grey-hover': '#454D54',
        'negative-red': '#F32448',
        'highlighted-negative-red': '#FF6681',
        'darker-negative-red': '#DA0C30',
        'grey-bg': '#EDF2F7',
        'negative-action-background': '#E9EDF1',
        'green-text': '#05C786',
        'primary-green': '#40BFBF',
        'primary-green-hover': '#00807F',
        'positive-green': '#29A37A',
        'border-grey': '#D5DBDD',
        'border-grey-highlighted': '#ABB2BA',
        'error-bg': '#FEE7EB',
        'disabled-text': '#C7CCD1',
        'selected-pill': '#042931',
        'secondary-button': '#DEE5ED',
        'secondary-button-hover': '#BDCCDB',
        'disabled-icon': '#ABB3BA',
        'dark-bg': '#002233',
        'nav-accent': '#3DD7F5',
        'information-bg': '#CCEEFF',
        'warning-yellow': '#FCF5CF',
        'blue-text': '#0088CC',
      },
      fontSize: {
        '13px': '0.8125rem',
      },
      boxShadow: {
        small: '0px 2px 8px 0px rgba(4, 41, 49, 0.10);',
      },
      fontFamily: {
        inter: [
          'Inter, sans-serif',
          {
            fontFeatureSettings: '"cv01", "cv02", "cv03", "cv04"',
          },
        ],
      },
      keyframes: {
        'dialog-show': {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        'dialog-hide': {
          from: {
            opacity: 1,
          },
          to: {
            opacity: 0,
          },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
