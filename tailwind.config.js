/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "serif"],
      },
      borderWidth: {
        1.5: "1.6px",
      },
    },
  },
  plugins: [],
};
