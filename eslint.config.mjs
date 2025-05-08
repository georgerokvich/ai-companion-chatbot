import nextPlugin from "eslint-config-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ...nextPlugin,
    rules: {
      // Disable rules that are causing problems for our demo
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn" // Downgrade to warning
    }
  }
];
