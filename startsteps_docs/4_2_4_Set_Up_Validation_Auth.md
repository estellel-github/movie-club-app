# Set Up Validation / Auth

# Context

### Why Install Zod?

- **Input Validation:** You’ll need to validate user inputs (e.g., registration data, login credentials) for almost every route.
- **Reusability:** Defining Zod schemas early allows you to reuse them across your project (e.g., request validation, type inference).

---

# Installs

### **Install Zod ✅**

```bash

pnpm add zod
```

### **Set Up Zod for Validation ✅**

- Create a file `src/utils/validation.ts` to store your schemas.

## **Example: User Validation Schema 👀**

```tsx
import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type UserInput = z.infer<typeof UserSchema>;

```

**Usage in Controller:**

```tsx
import { UserSchema } from '../utils/validation';

export const registerUser = (req, res) => {
  try {
    const userData = UserSchema.parse(req.body); // Validate input
    // Proceed with user registration logic
    res.status(201).send({ success: true });
  } catch (error) {
    res.status(400).send(error.errors);
  }
};

```

---

# Auth: Jsonwebtoken / Argon2

### 📦 **Install Dependencies ✅**

Run the following command to install the required packages:

```bash
pnpm add jsonwebtoken argon2
pnpm add -D @types/jsonwebtoken

```

- **`jsonwebtoken`**: To create and verify JWT tokens.
- **`argon2`**: A modern and secure library for hashing and verifying passwords.
- **`@types/jsonwebtoken`**: TypeScript types for `jsonwebtoken`.

---