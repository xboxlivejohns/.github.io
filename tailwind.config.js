/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './assets/**/*.{js,css,html}',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF9DB',
          100: '#FFF2A6',
          200: '#FFE66D',
          300: '#FFDA38',
          400: '#FFD60A',
          500: '#FFC700',
          600: '#E6B300',
          700: '#B38A00',
          800: '#806200',
          900: '#4D3A00'
        },
        amber: {
          50: '#FFF9DB',
          100: '#FFF2A6',
          200: '#FFE66D',
          300: '#FFDA38',
          400: '#FFD60A',
          500: '#FFC700',
          600: '#E6B300',
          700: '#B38A00',
          800: '#806200',
          900: '#4D3A00'
        },
        ink: '#0B0B0B',
        paper: '#FFFFFF',
        surface: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      }
    }
  }
};
