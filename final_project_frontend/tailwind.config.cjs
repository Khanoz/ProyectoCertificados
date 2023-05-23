/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      primary: "#20FC8F",
      secondary: "#3F5E5A",
      light: "#FFFFFF",
      dark: "#2D2D2A",
      gray: "#D9D9D9",
      faded_gray: "#D9D9D9C0",
      red: "#DB504A",
      blue: "#576CA8",
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}