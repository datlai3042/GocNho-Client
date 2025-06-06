import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "second-color": "var(--second-color)",
        "background-input": "var(--background-input)",
        "line-color": "var(--line-color)",
        'color-main': 'var(--color-main)',
        'color-main-hover': 'var(--color-main-hover)',
        'color-section-theme': 'var(--color-section-theme)',
        'color-gap-empty': 'var(--color-gap-empty)',
        'text-theme': 'var(--text-theme)',
        'border-color': 'var(--border-color)',
        'bg-input-theme': 'var(--bg-input-theme)',

        "mini-color": "var(--mini-color)",

      }
    },
  },
  plugins: [],
};

export default config;
