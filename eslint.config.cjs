// Minimal ESLint v9 flat config to satisfy lint-staged and basic linting
// No external plugins required; adjust as needed.

module.exports = [
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Keep lint noise low by default; tighten later if desired
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-undef": "off",
    },
  },
];
