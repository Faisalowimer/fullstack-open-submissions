import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginTs from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser"; // Import the TypeScript parser

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      // Disable react-in-jsx-scope for React 17+ (JSX no longer requires React in scope)
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    plugins: {
      "@typescript-eslint": pluginTs,
      "react": pluginReact,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...pluginTs.configs.recommended.rules, // Use TypeScript recommended rules
      ...pluginReact.configs.recommended.rules, // Use React recommended rules
    },
  },
];
