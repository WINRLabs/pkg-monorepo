/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@winrlabs/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  globals: {
    NodeJS: true,
  },
};
