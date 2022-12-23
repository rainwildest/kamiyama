module.exports = {
  content: [
    // "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/layout/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontSize: {
        "2.5xl": ["28px", "28px"]
      },
      width: {
        25: "100px",
        33: "132px",
        88: "352px"
      },
      height: {
        25: "100px",
        29.5: "120px",
        33: "132px"
      },
      colors: {
        gray: {
          1000: "#333333",
          1100: "#f2f2f7",
          1200: "#666666",
          1300: "#cfcfcf",
          1400: "#C9C9C9"
        },
        sky: {
          1000: "#68C7FB",
          1100: "rgba(61,179,244,0.3)"
        },
        blue: {
          1000: "#11223B",
          1100: "#0B182C",
          1200: "#3DB3F4",
          1300: "#377EF7"
        },
        orange: {
          1000: "#f7924e",
          1100: "#EA5514",
          1200: "rgba(234, 85, 20, 0.3)"
        },
        red: {
          1000: "#f74e62"
        }
      },
      boxShadow: {
        // lg: "box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);"
      },
      letterSpacing: {
        0.2: "0.2em"
      }
    }
  },
  plugins: []
};
