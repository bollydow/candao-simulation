// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Nowe ścieżki w Next.js 13
    "./app/pages/**/*.{js,ts,jsx,tsx}", // Dodane dla kompatybilności
    "./app/components/**/*.{js,ts,jsx,tsx}", // Dodane dla kompatybilności
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
