import { defineConfig } from "eslint-define-config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import parserTypescript from "@typescript-eslint/parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    files: ["src/**/*.ts"],
    ignores: ["node_modules/", "dist/", "coverage/", "src/__tests__/"],
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: path.resolve(__dirname, "./tsconfig.json"),
        tsconfigRootDir: __dirname,
      },
      globals: {
        NodeJS: true,
      },
    },
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
      "@typescript-eslint": eslintPluginTypescript,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "warn",

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/consistent-type-imports": "error",

      "import/order": "off",

      "prettier/prettier": "error",

      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { allowSameFolder: false, rootDir: "src", prefix: "@" },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: path.resolve(__dirname, "./tsconfig.json"),
        },
        alias: {
          map: [["@", "./src"]],
          extensions: [".ts", ".js", ".jsx", ".json"],
        },
      },
    },
    ignores: ["dist/**", "node_modules/**", "src/tests/**"],
  },
]);
