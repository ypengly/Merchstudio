/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF9",
        ink: "#1A1A18",
        steel: "#6B6D76",
        line: "#E4E3DE",
        cobalt: {
          DEFAULT: "#2F5DFF",
          dark: "#1E3FCC",
          light: "#EAEFFF",
        },
        signal: {
          DEFAULT: "#FF5A1F",
          light: "#FFEDE4",
        },
        panel: "#F3F2EE",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        panel: "10px",
        control: "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,26,24,0.04), 0 8px 24px -12px rgba(26,26,24,0.12)",
      },
    },
  },
  plugins: [],
};
