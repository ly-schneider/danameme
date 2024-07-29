/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      home: "940px",
      register: "880px",
      nav: "510px",
      xs: "450px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        text: "var(--text)",

        success: "var(--success)",

        error: "var(--error)",

        background: "var(--background)",

        primary: "var(--primary)",

        secondary: "var(--secondary)",

        muted: "var(--muted)",

        mutedLight: "var(--muted-light)",

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      fontFamily: {
        effra: "var(--effra)",
        darkmode: "var(--darkmode)",
        lato: "var(--lato)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
