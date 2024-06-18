// .eslintrc.js
module.exports = {
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:tailwindcss/recommended',
  ],
  plugins: [
    'tailwindcss',
  ],
  rules: {
    // Twoje reguły
    'tailwindcss/classnames-order': 'warn',  // 'off'
  },
};
