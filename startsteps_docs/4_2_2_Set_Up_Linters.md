# Set Up Linters

# **Install ESLint and Required Plugins ✅**

Run this command in your project:

```bash
pnpm install --save-dev eslint eslint-define-config @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-import eslint-plugin-node eslint-plugin-prettier prettier 

```

---

# **Create ESLint Configuration File ✅**

Create an `eslint.config.js` file in your project's root directory:

```jsx
import { defineConfig } from 'eslint-define-config';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import parserTypescript from '@typescript-eslint/parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    files: ['**/*.{js,ts}'],
    ignores: ['node_modules', 'dist', 'coverage'],
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
      },
      globals: {
        NodeJS: true,
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Core ESLint rules
      'no-unused-vars': 'off',
      'no-console': 'warn',

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',

      // Import rules
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'error',

      // Prettier integration
      'prettier/prettier': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(__dirname, './tsconfig.json'),
        },
      },
    },
  },
]);
```

---

# **Create Prettier Configuration ✅**

Create a `.prettierrc` file in the root of your project with the following:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80
}
```

---

# **Add Scripts to `package.json` ✅**

Update your `package.json` scripts section:

```json
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
// ...
}
```

---

# **Configure ignores ✅**

Add `ignorePatterns` in eslint config file:

```
ignorePatterns: ["node_modules/", "dist/", "coverage/"],
```

---

# **Integrate With VS Code ✅**

For a smoother development experience in VS Code, add a `.vscode/settings.json` file:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true},
  "eslint.validate": ["javascript", "typescript"]
}
```

---

# **Test ESLint ✅**

Run the following command to test linting: ✅

```bash
pnpm lint
```

To automatically fix fixable issues: ✅

```bash
pnpm lint:fix
```

---

# **Mass (Initial) Linting in a Separate Branch ✅**

## **Create a New Branch ✅**

Create a branch specifically for linting fixes:

```bash
git checkout -b mass-linting
```

## **Run Linting Fixes ✅**

Run the ESLint autofix command to apply fixes:

```bash
pnpm run lint:fix
```

## **Review the Changes ✅**

Use `git status` and `git diff` to review the changes made by the linter.

- **To check all changes**:
    
    ```bash
    git diff
    ```
    
- **To check changes for a specific file**:
    
    ```bash
    git diff path/to/file.ts
    ```
    

## **Commit the Changes ✅**

Once you're satisfied with the fixes:

```bash

git add .
git commit -m "Apply ESLint autofix"
```

## **Push the Branch ✅**

Push the branch to your remote repository for further review or collaboration:

```bash
git push origin mass-linting
```

## **Merge the Linting Branch into Main ✅**

Once you've reviewed and are confident the fixes are good, merge the `mass-linting` branch into your `main` branch:

### **Switch to Main Branch ✅**

```bash
git checkout main
```

### **Merge the Linting Branch ✅**

```bash
git merge mass-linting
```

### **Delete the Linting Branch (Optional) ✅**

If you're done with the branch, you can delete it:

```bash
git branch -d mass-linting
```

---

# Fix CR/LF Issues (Linux / Windows) ✅

The error **"Delete `␍`"** is caused by **line ending differences** in your files. Prettier and ESLint expect **LF** line endings (used in Linux/Unix), but your files have **CRLF** line endings (used in Windows). This happens when working across platforms like Windows and WSL.

---

### **Steps to Fix Line Ending Issues**

### **1. Update Prettier Configuration ✅**

Ensure Prettier enforces LF line endings. Add or update the following in your `.prettierrc` file:

```json
{
  "endOfLine": "lf"
}
```

This tells Prettier to normalize all line endings to **LF**.

---

### **2. Update `.gitattributes` ✅**

To ensure consistent line endings across environments, add a `.gitattributes` file at the root of your project:

```
* text=auto eol=lf
```

This ensures Git converts all line endings to LF when checking files into the repository.

---

### **3. Run Prettier Fix ✅**

To fix existing files, run Prettier across your project:

```bash
pnpm prettier --write .
```

This will replace **CRLF** line endings with **LF** in all files.

---

### **4. Configure VSCode Settings ✅**

To prevent future CRLF issues, configure VSCode to use LF by default:

- Open **Settings** (`Ctrl + ,` or `Cmd + ,`).
- Search for `files.eol`.
- Set it to **LF** (`\n`).

Alternatively, add this to your **workspace settings** (`.vscode/settings.json`):

```json
{
  "files.eol": "\n",
  "editor.formatOnSave": true}
```

---

### **5. Verify Fix ✅**

Run your linter again:

```bash
pnpm run lint
```

The errors related to line endings should no longer appear.

---

# **Verify in CI/CD ⌛**

You can extend this by integrating ESLint checks into your GitHub Actions pipeline to ensure that linting errors are caught during PRs.