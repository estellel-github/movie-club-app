# 4.1 Base Project Setup

# Create repo ✅

- **Create repo** https://github.com/estellel-github/book-club-app
    - Add readme file
    - Add Node gitignore

- **Clone repo** from CLI in local parent folder

```bash
git clone [git@github.com](mailto:git@github.com):estellel-github/book-club-app.git
```

# Initial Config & Dependency Install ✅

- **In repo root, run `npm init -y`**:
This creates the default `package.json`.
- **Manually Update `package.json`**:
Update the existing file to match this:
    
    ```json
    {
      "name": "book-club-app",
      "version": "1.0.0",
      "type": "module",
      "scripts": {
        "dev": "tsx watch src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js"
      },
      "dependencies": {
        "dotenv": "^16.4.7",
        "express": "^4.21.2",
        "pg": "^8.13.1",
        "reflect-metadata": "^0.1.14",
        "typeorm": "^0.3.20"
      },
      "devDependencies": {
        "@types/express": "^4.17.21",
        "@types/node": "^20.17.10",
        "tsconfig-paths": "^4.2.0",
        "tsx": "^4.19.2",
        "typescript": "^5.7.2"
      },
      "engines": {
        "pnpm": ">=8.0.0"
      }
    }
    ```
    
- **Run `pnpm install`**:
After updating the `package.json`, this command will install all dependencies and devDependencies as listed in the package.json.

Since I use pnpm I add an advisory in the package.json.

This means any collaborators should use pnpm for this project.

Needs to be added to any readme/ documentation / collaboration docs.

See [Notes: PNPM, Docker, CI/CD](Notes%20PNPM,%20Docker,%20CI%20CD%2015b531f969c9809c809ecac8a584d4ec.md)  on how CI/CD (but true also for Docker) should reflect the use of pnpm.

# Set Up Initial Directory Structure ✅

```
src/
├── app/
│   ├── index.ts         # App entry logic (server setup, express initialization)
│   └── middlewares.ts   # Global middlewares (e.g., error handling, authentication)
├── config/
│   ├── database.ts      # Db configuration
│   └── env.ts           # Environment variable parser
├── entities/            # Db schema or reusable models
│   ├── User.ts          # User model/entity
│   ├── Book.ts          # Book model/entity
│   └── Event.ts         # Event model/entity
├── modules/             # Feature-based modules
│   ├── admin/
│   │   ├── controller.ts # Handles HTTP requests for admin-related features
│   │   ├── service.ts    # Business logic for admin-related operations
│   │   └── route.ts      # Admin routes
│   ├── user/
│   │   ├── controller.ts # Handles HTTP requests for user-related features
│   │   ├── service.ts    # Business logic for user-related operations
│   │   └── route.ts      # User routes
│   ├── book/
│   │   ├── controller.ts # Handles HTTP requests for book-related features
│   │   ├── service.ts    # Business logic for book-related operations
│   │   └── route.ts      # Book routes
│   ├── event/
│   │   ├── controller.ts # Handles HTTP requests for event-related features
│   │   ├── service.ts    # Business logic for event-related operations
│   │   └── route.ts      # Event routes
│   ├── rsvp/
│   │   ├── controller.ts # Handles HTTP requests for RSVP-related features
│   │   ├── service.ts    # Business logic for RSVP-related operations
│   │   └── route.ts      # RSVP routes
│   ├── comment/
│   │   ├── controller.ts # Handles HTTP requests for comment-related features
│   │   ├── service.ts    # Business logic for comment-related operations
│   │   └── route.ts      # Comment routes
├── utils/
│   ├── logger.ts         # Logger utility (e.g., Winston or Pino configuration)
│   ├── auth.ts           # Authentication utilities (e.g., JWT handling)
│   └── validator.ts      # Validation utilities (e.g., Zod schemas)
└── index.ts             # Application entry point
```

# Configure TypeScript ✅

## tsconfig.json

```tsx
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}

```

# **Configure TypeORM ✅**

1. **Set Up an `.env` File**: Create an `.env` file in the project root:
    
    ```
    PORT=3000
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=bookclub_db
    DB_PASSWORD=Pq8&Lm2z
    DB_NAME=bookclub_db
    ```
    
2. **Create a `src/config/env.ts`**:
    
    ```tsx
    import dotenv from 'dotenv';
    
    dotenv.config();
    
    export const config = {
        port: process.env.PORT,
        db: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            name: process.env.DB_NAME,
        },
    };
    
    if (!config.db.user) {
        console.warn('Warning: DB_USER is not set in the .env file.');
    }
    
    if (!config.db.password) {
        console.warn('Warning: DB_PASSWORD is not set in the .env file.');
    }
    ```
    
3. **Set Up the TypeORM Data Source**: Create `src/config/database.ts`:
    
    ```tsx
    import 'reflect-metadata';
    import { DataSource } from 'typeorm';
    import { config } from './env.js';
    
    import { User } from '../entities/User.js';
    import { Book } from '../entities/Book.js';
    import { Event } from '../entities/Event.js';
    import { RSVP } from '../entities/RSVP.js';
    import { EventComment } from '../entities/EventComment.js';
    
    export const AppDataSource = new DataSource({
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        username: config.db.user,
        password: config.db.password,
        database: config.db.name,
        entities: [User, Book, Event, RSVP, EventComment],
        synchronize: true,
        logging: true,
    });
    
    const connectDB = async () => {
        let retries = 5;
        while (retries) {
            try {
                await AppDataSource.initialize();
                console.log('Connected to the database');
                break;
            } catch (error) {
                console.error(`Database connection failed. Retrying... (${retries} retries left)`);
                retries -= 1;
                await new Promise(res => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
            }
        }
        if (!retries) process.exit(1);
    };
    ```
    

### ⚠️ Later: May move from `synchronize: true` to migrations ❌

### Why Avoid `synchronize: true` in Production?

1. **What `synchronize: true` Does**:
    - Automatically creates or updates database tables and schemas to match your entity definitions.
    - It's convenient for development but can lead to unexpected changes (e.g., data loss, schema overwrites) in production.
2. **Risks in Production**:
    - Dropping or altering existing tables could lead to irreversible data loss.
    - Unexpected schema updates might break compatibility with existing data or applications.

---

### How to Use Migrations Instead

Migrations provide better control by explicitly defining schema changes. Here's how to set up and use migrations in your project:

### 1. **Update `AppDataSource` Configuration**

Replace `synchronize: true` with `migrations` configuration:

```tsx
typescript
Copier le code
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    entities: [User, Book, Event, RSVP, EventComment],
    migrations: ['src/migrations/*.ts'], // Path to migration files
    migrationsTableName: 'typeorm_migrations', // Optional: Custom table for migrations
    logging: true,
});

```

---

### 2. **Install Required TypeORM CLI Dependencies**

You need the TypeORM CLI to generate and run migrations:

```bash
bash
Copier le code
npm install typeorm --save-dev

```

---

### 3. **Add TypeORM CLI Configuration**

In `package.json`, add a TypeORM CLI script:

```json
json
Copier le code
"scripts": {
    "typeorm": "typeorm"
}

```

Create a `typeorm.config.ts` in the project root to configure the CLI:

```tsx
typescript
Copier le code
import { DataSource } from 'typeorm';
import { AppDataSource } from './src/config/database';

export default AppDataSource;

```

---

### 4. **Generate a Migration**

To create a new migration file that reflects your entities, run:

```bash
bash
Copier le code
npm run typeorm migration:generate ./src/migrations/InitialSchema -d ./typeorm.config.ts

```

This command will:

- Compare your database schema with your entities.
- Generate a migration file in `src/migrations` (e.g., `src/migrations/InitialSchema.ts`).

---

### 5. **Run Migrations**

Apply the migration to your database:

```bash
bash
Copier le code
npm run typeorm migration:run -d ./typeorm.config.ts

```

This will:

- Execute the SQL commands in the migration file to create or update the database schema.

---

### 6. **Manage Future Schema Updates**

1. When you make changes to entities (e.g., add a new column or table):
    - Generate a new migration:
        
        ```bash
        bash
        Copier le code
        npm run typeorm migration:generate ./src/migrations/AddNewColumn -d ./typeorm.config.ts
        
        ```
        
2. Apply the migration:
    
    ```bash
    bash
    Copier le code
    npm run typeorm migration:run -d ./typeorm.config.ts
    
    ```
    

---

### Final Configuration

Your `AppDataSource` should look like this in production:

```tsx
typescript
Copier le code
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    entities: [User, Book, Event, RSVP, EventComment],
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'typeorm_migrations',
    logging: true,
});

```

---

### Benefits of This Approach

- **Safety**: Migrations prevent accidental schema changes in production.
- **Control**: Explicit migration files document schema changes, making it easier to debug and collaborate.
- **Scalability**: Future-proof as your project grows.

---

# **Define Entities ✅**

- Avoid separate references like API draft, diagram code, entities. → Single-source as authority before starting to code entities (DBdiagram code in this case)
- Be careful to have a definite, well thought-out schema before starting to write entities!
- Make sure to use ENUM whenever appropriate
- Be careful when setting ManyToOne / OneToMany to Avoid circular dependencies. Have them only if necessary depending on querying needs.
    - Use [https://www.npmjs.com/package/madge](https://www.npmjs.com/package/madge) to check for circular dependencies!

---

# **Set Up the Express Server ✅**

1. **Create `src/index.ts`  ✅**
- + Set all routes up based on the modules

```tsx
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

import adminRoutes from './modules/admin/route.js';
import userRoutes from './modules/user/route.js';
import bookRoutes from './modules/book/route.js';
import eventRoutes from './modules/event/route.js';
import rsvpRoutes from './modules/rsvp/route.js';
import commentRoutes from './modules/comment/route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);
app.use('/api/comments', commentRoutes);

// Start server and connect to the database
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit process on database connection failure
  }
});
```

---

# **Set Up Docker ✅**

If not done already:

- Install Docker Engine https://docs.docker.com/engine/install/ubuntu/
- Install Docker Compose https://docs.docker.com/compose/install/linux/

1. **Create `Dockerfile`**:
    1. Customize for pnpm
    
    ```
    FROM node:18-alpine
    
    WORKDIR /usr/src/app
    
    COPY package*.json ./
    RUN npm install -g pnpm && pnpm install
    
    COPY . .
    
    RUN pnpm run build
    
    EXPOSE 3000
    
    CMD ["pnpm", "start"]
    ```
    
2. **Create `docker-compose.yml`**:
    1. Customize all parts below, particularly .env variables
    2. Added health check compared to course template
    3. Add volumes at the end
    
    ```
    services:
      app:
        build: .
        ports:
          - "3000:3000"
        volumes:
          - .:/usr/src/app
          - /usr/src/app/node_modules
        env_file:
          - .env
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
          interval: 30s
          timeout: 10s
          retries: 3
    
      db:
        image: postgres:15
        restart: always
        environment:
          POSTGRES_USER: ${DB_USER}
          POSTGRES_PASSWORD: ${DB_PASSWORD}
          POSTGRES_DB: ${DB_NAME}
        ports:
          - "5432:5432"
        volumes:
          - postgres_data:/var/lib/postgresql/data
        healthcheck:
          test: ["CMD", "pg_isready", "-U", "${DB_USER}"]
          interval: 10s
          timeout: 5s
          retries: 5
    
    volumes:
      postgres_data:
    ```
    
3. **Run the Project**:
    
    ```bash
    docker-compose up --build
    ```
    

# **Set up PostgreSQL Database ✅**

December 13, 2024 2hours debugging 

- psql permission issues due to bad install → uninstalled all and reinstalled using psql docs for ubuntu

- db initialization issue

db-1   | 2024-12-13 10:04:32.226 UTC [125] FATAL:  database "bookclub_backend" does not exist

[psql: FATAL: database "<user>" does not exist](https://stackoverflow.com/questions/17633422/psql-fatal-database-user-does-not-exist)

Previously had user name : bookclub_backend

and db name: bookclub_db

But Psql was by default trying to connect to a db with same name as my user…

Solved by changing config to have db user match db user name

```
      POSTGRES_USER: "${DB_USER}"
      POSTGRES_PASSWORD: "${DB_PASSWORD}"
      POSTGRES_DB: "${DB_NAME}"
```

[Notes: PNPM, Docker, CI/CD](Notes%20PNPM,%20Docker,%20CI%20CD%2015b531f969c9809c809ecac8a584d4ec.md)