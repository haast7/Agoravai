import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#005599",
          dark: "#004080",
          light: "#0066B3",
        },
        background: {
          DEFAULT: "#0F172A",
          card: "#1E293B",
        },
      },
    },
  },
  plugins: [],
};
export default config;





