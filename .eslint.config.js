export default [
  {
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
    plugins: ["prettier", "@typescript-eslint"],
    rules: {
      "prettier/prettier": ["error"],
    },
  },
];