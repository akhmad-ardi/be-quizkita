// @ts-check

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.ts"],
    ignores: ["dist", "node_modules"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly" // ✅ ini biar process & console dikenali
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];
