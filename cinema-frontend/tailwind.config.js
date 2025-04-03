module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Add debug colors
      colors: {
        debug: {
          red: 'rgba(255, 0, 0, 0.2)',
          blue: 'rgba(0, 0, 255, 0.2)',
          green: 'rgba(0, 255, 0, 0.2)'
        }
      }
    },
  },
  plugins: [],
  // Add important selector to debug
  important: '#root', // Or true for !important
  corePlugins: {
    // Ensure these aren't disabled
    textColor: true,
    opacity: true,
    visibility: true,
    display: true
  }
}