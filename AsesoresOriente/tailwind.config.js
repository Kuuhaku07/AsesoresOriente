/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2aaec9',
        'primary-light': 'rgba(42, 174, 201, 0.3)',
        'primary-hover': 'rgb(2, 94, 112)',
        'primary-blue': '#007bff',
        background: '#ffffff',
        'background-2': '#ebf3fa',
        selected: '#bbecf7',
        text: '#333333',
        'text-light': '#666666',
        white: '#ffffff',
        'gray-light': 'rgba(248, 249, 250, 0.8)',
        sidebar: '#fafafa',
      },
      fontFamily: {
        primary: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      fontSize: {
        small: '14px',
        normal: '16px',
        large: '20px',
        xlarge: '24px',
      },
      fontWeight: {
        normal: '400',
        bold: '700',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        'menu-offset': '90px',
        'page-container-padding': '160px',
        1000: '250rem',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      borderWidth: {
        DEFAULT: '4px',
      },
      zIndex: {
        menu: '10',
        modal: '100',
      },
    },
  },
  plugins: [],
}