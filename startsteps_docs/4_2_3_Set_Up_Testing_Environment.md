# Set Up Testing Environment

**Important aspects:**

1. Database and server separation during tests.
2. Support for ES Modules in Jest.
3. Environment-specific configurations for testing.
4. Running tests with a clean database state.

---

# **Install Required Dependencies ✅**

Run the following command to install dependencies for testing, TypeScript, and module support:

```
npm install --save-dev jest **ts-jest supertest @types/jest @types/supertest=**
```

---

# **Check/adjust connectDB ✅**

Ensure your `connectDB` function initializes the database based on the current environment, in **`src/config/database.ts`. ✅**

**Key Points:**

- Use `config` to load environment variables dynamically. ✅
- Ensure the `test_db` database exists for running tests. ✅

---

# **Check/adjust index.ts = Avoid server/db start during tests ✅**

Update your `index.ts` to avoid starting the server during tests.

**`src/index.ts`**

= Wrap the start server/db connection logic with conditional:

```tsx
if (process.env.NODE_ENV !== 'test') {
// ...
}
```

---

# Initialize Jest Configuration ✅

Create a Jest configuration file using the following command:

```bash
pnpm jest --init
```

During the setup, you'll be prompted to choose options. Here's what to select:

- **Choose the preset**: `ts-jest`
- **Test environment**: `node`
- **Use Babel**: `No`
- **Enable code coverage**: `Yes` (if you want coverage reports)
- **Configure Jest to find test files**: `Yes`
- **Choose file extension for tests**: `ts`
- **Set Jest to clear mocks**: `Yes`

This will create a `jest.config.ts` file.

**Recheck/adjust `jest.config.`ts ✅**

```tsx
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

export default config;
```

---

# Add Jest Scripts to `package.json` ✅

Update your `package.json` scripts to include:

```json
    "test": "NODE_ENV=test jest --verbose",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage",
```

---

# Create Dummy Test File ✅

Create a dummy test file.

`dummy.test.ts`

```tsx
describe('Dummy Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
```

---

# **Run Tests ✅**

Run your tests using:

```
 npm run test
```

---

# Next Steps

- **Write Tests**: Add meaningful tests for your entities, services, and routes.
- **Test Environment Setup**: Use `.env.test` for your test environment.
- **CI/CD**: Integrate Jest into your CI/CD pipeline to run tests automatically on each push or pull request.