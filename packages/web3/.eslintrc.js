/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@winrlabs/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
  globals: {
    NodeJS: true,
  },
  // overrides: [
  //   {
  //     files: ["jest.config.js", "jest.config.cjs"],
  //     parserOptions: {
  //       sourceType: "script", // CommonJS files should use 'script' as the source type
  //       project: "./packages/web3/tsconfig.lint.json",
  //     },
  //   },
  // ],
};
