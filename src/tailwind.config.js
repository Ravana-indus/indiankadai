// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html' // Add this if you're using Tailwind classes in your HTML
  ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f8f9fa',
            100: '#e9ecef',
            200: '#dee2e6',
            300: '#ced4da',
            400: '#adb5bd',
            500: '#6c757d',
            600: '#495057',
            700: '#343a40',
            800: '#212529',
            900: '#0f172a',
          },
        },
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        fontFamily: {
          sans: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'sans-serif',
          ],
        },
        boxShadow: {
          'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        },
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'bounce-slow': 'bounce 3s infinite',
        },
        transitionProperty: {
          'height': 'height',
          'spacing': 'margin, padding',
        },
        zIndex: {
          '60': '60',
          '70': '70',
          '80': '80',
          '90': '90',
          '100': '100',
        },
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      function ({ addComponents }) {
        addComponents({
          '.container': {
            maxWidth: '100%',
            '@screen sm': {
              maxWidth: '640px',
            },
            '@screen md': {
              maxWidth: '768px',
            },
            '@screen lg': {
              maxWidth: '1024px',
            },
            '@screen xl': {
              maxWidth: '1280px',
            },
            '@screen 2xl': {
              maxWidth: '1536px',
            },
          }
        })
      },
    ],
  };