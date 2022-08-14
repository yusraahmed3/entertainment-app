module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      spacing: {
        110: "32rem",
      },
      colors: {
        customBlue: "#6290C8",
        dark: "#0b0b0c",
        darker: "#050609",
        light: "#e5e6e4",
      },
    },
  },
  plugins: [],
};
