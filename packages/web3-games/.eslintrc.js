/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@winrlabs/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
  },
  globals: {
    NodeJS: true,
  },
  overrides: [
    {
      files: ["jest.config.js", "jest.config.cjs"],
      parserOptions: {
        sourceType: "script", // CommonJS files should use 'script' as the source type
        project: "./tsconfig.lint.json", // Specify your tsconfig for linting
      },
    },
  ],
};
