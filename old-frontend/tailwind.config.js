// tailwind.config.js
const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  theme: {
  //   colors: {
  //     primary: {
  //       50: "#F3F3F6",
  //       100: "#D0D0DC",
  //       200: "#B9B9CB",
  //       300: "#A1A1BA",
  //       400: "#8A8AA8",
  //       500: "#727297",
  //       600: "#68688D",
  //       700: "#5F5F81",
  //       800: "#575775",
  //       900: "#4E4E6A",
  //       950: "#343446",
  //     },
  //   },
  //   fontFamily: {
  //     body: [
  //       "Inter",
  //       "ui-sans-serif",
  //       "system-ui",
  //       "-apple-system",
  //       "system-ui",
  //       "Segoe UI",
  //       "Roboto",
  //       "Helvetica Neue",
  //       "Arial",
  //       "Noto Sans",
  //       "sans-serif",
  //       "Apple Color Emoji",
  //       "Segoe UI Emoji",
  //       "Segoe UI Symbol",
  //       "Noto Color Emoji",
  //     ],
  //     sans: [
  //       "Inter",
  //       "ui-sans-serif",
  //       "system-ui",
  //       "-apple-system",
  //       "system-ui",
  //       "Segoe UI",
  //       "Roboto",
  //       "Helvetica Neue",
  //       "Arial",
  //       "Noto Sans",
  //       "sans-serif",
  //       "Apple Color Emoji",
  //       "Segoe UI Emoji",
  //       "Segoe UI Symbol",
  //       "Noto Color Emoji",
  //     ],
  //   },
  },
  darkMode: "class",
  plugins: [nextui(), require("flowbite/plugin")],
};

