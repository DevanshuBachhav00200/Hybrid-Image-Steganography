/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        primary: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          hover: "#7c3aed",
        },
      },
    },
  },
  plugins: [],
};
