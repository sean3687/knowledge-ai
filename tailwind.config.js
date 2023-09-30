/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      custom: "1000px",
      animation: {
        'bounce200': 'bounce 1s infinite 200ms',
        'bounce400': 'bounce 1s infinite 400ms',
        expandFromBottom: 'expandFromBottom 0.05s ease-out forwards',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
  mode: 'jit',
};
