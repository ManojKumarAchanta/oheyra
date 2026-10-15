/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0C',
        surface: {
          DEFAULT: '#141419',
          elevated: '#1C1C24',
          highlight: '#252530',
        },
        border: {
          subtle: '#23232E',
          DEFAULT: '#2E2E3D',
          glow: '#3B3B4F',
        },
        electric: {
          violet: '#8B5CF6',
          coral: '#F43F5E',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          emerald: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
