# Configure multiple environments

# 1st Pass

Old .env for backup: ✅

```
PORT=3000
DB_HOST=db
DB_PORT=5432
DB_USER=bookclub_db
DB_PASSWORD=
DB_NAME=bookclub_db
```

Update gitignore ✅

```
# dotenv environment variable files
.env.* // ADDED
.env.development.local
.env.test.local
.env.production.local
.env.local
```

### **Step 1: Set Up Environment Files**

You need separate `.env` files for each environment. Here’s how to adapt them to your project:

- **`.env.dev` (Development)**: ✅
    
    ```
    PORT=3000
    POSTGRES_USER=bookclub_backend
    POSTGRES_PASSWORD=
    POSTGRES_DB=bookclub_db
    POSTGRES_HOST=db
    NODE_ENV=development
    JWT_SECRET=dev_secret
    
    ```
    
- **`.env.test` (Testing)**: ✅
    
    ```
    PORT=3001
    POSTGRES_USER=bookclub_backend
    POSTGRES_PASSWORD=
    POSTGRES_DB=bookclub_test
    POSTGRES_HOST=localhost
    NODE_ENV=test
    JWT_SECRET=test_secret
    
    ```
    
- **`.env.prod` (Production)**: ✅
    
    ```
    PORT=3000
    POSTGRES_USER=bookclub_backend
    POSTGRES_PASSWORD=
    POSTGRES_DB=bookclub_db
    POSTGRES_HOST=db
    NODE_ENV=production
    JWT_SECRET=prod_secret
    
    ```
    

### **Step 2: Update `config/env.ts` ✅**

Modify your `env.ts` to dynamically load the correct environment file based on `NODE_ENV`.

```tsx
import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.prod"
    : process.env.NODE_ENV === "test"
      ? ".env.test"
      : ".env.dev";

dotenv.config({ path: envFile });

export const config = {
  port: process.env.PORT,
  db: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
  jwtSecret: process.env.JWT_SECRET || "default_secret",
};
```

### **Step 3: Automate Database Initialization ✅**

Create a script to initialize your databases for testing and development.

- **`init-database.sh`:**
    
    ```bash
    #!/bin/bash
    set -e
    
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
        CREATE DATABASE bookclub_db;
        CREATE DATABASE bookclub_test;
    EOSQL
    ```
    

Place this in the project root.

### **Step 4: Update `docker-compose.yml` ✅**

Ensure your Docker Compose setup handles multiple environments.

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env.prod
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:17-alpine
    restart: always
    ports:
      - "5432:5432"
    env_file:
      - .env.prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-database.sh:/docker-entrypoint-initdb.d/init-database.sh
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $POSTGRES_USER -d $POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### **Step 5: Update `package.json` Scripts ✅**

Add scripts to streamline switching between environments.

```json
"scripts": {
  "dev": "NODE_ENV=development pnpm run start",
  "test": "NODE_ENV=test jest",
  "build": "tsc",
  "start": "NODE_ENV=production node dist/index.js"
}

```

### **Step 6: Verify the Setup**

- **For Development: ✅**
    
    ```bash
    pnpm run dev
    // script: "dev": "docker compose --env-file .env.dev up --build",
    ```
    
- **For Testing: ✅**
    
    ```bash
    pnpm test
    // script: "test": "NODE_ENV=test jest --verbose",
    ```
    
- **For Production: ✅**
    
    ```bash
    pnpm run prod
    // script: "prod": "docker compose --env-file .env.prod up --build",
    ```
    
- **To stop dev/prod: ✅**
    
    ```bash
    pnpm run stop
    // script: "stop": "docker compose down -v",
    ```
    

### **Next Steps**

1. **Validate with DBeaver:** Ensure all databases (`bookclub_db` and `bookclub_test`) exist and are accessible. ✅
2. **Add JWT Secret to Code:** Verify JWT authentication works across all environments. **LATER**
3. **Run Tests:** Validate the testing environment with sample tests. **LATER**
4. **Deploy:** Use `.env.prod` for deployment. **LATER**

### Difference DB/LocalHost

can you explain why the difference in hosts betwen different envs : DB or LOCALHOST?

### ChatGPT a dit :

ChatGPT

The difference in hosts (`db` vs. `localhost`) between environments is based on **how the services are deployed and accessed**. Here's a detailed explanation:

---

### **Development Environment**

- **Host: `db`**
- In a Docker Compose setup, services communicate with each other using **service names** (e.g., `db`) as hostnames.
- In this case, your app service (Node.js) connects to the database service (PostgreSQL) within the same Docker network. The hostname `db` is resolved to the IP of the database container by Docker's internal DNS.
- **Why `db`?**
    - `db` is the name of the PostgreSQL service in your `docker-compose.yml`. Docker automatically makes this name resolvable as a hostname within the Docker network.

---

### **Testing Environment**

- **Host: `localhost`**
- Testing often runs outside Docker (e.g., on your local machine during CI/CD or local test execution).
- In this case, you might not use Docker for PostgreSQL during tests. Instead, PostgreSQL is accessed directly on your local machine (`localhost`).
- **Why `localhost`?**
    - This assumes PostgreSQL is running locally on your machine or in a separate process that listens on `localhost:5432`.

---

### **Production Environment**

- **Host: `db`**
- In production, you often deploy using Docker Compose or Kubernetes, where services again communicate within a network using service names.
- Similar to the development environment, `db` is used because the app and database run in containers, and `db` resolves to the database container.

---

### **When to Use `localhost`**

- Use `localhost` only when the database is running **on the same machine as the app** (e.g., during testing on your local machine or CI/CD pipeline).

### **When to Use `db`**

- Use `db` when services run in a **Docker network**, and the database is a service defined in your `docker-compose.yml`.

---

### **Flexibility in Your Configuration**

Your `config/env.ts` dynamically loads the correct host depending on `NODE_ENV`. This ensures that:

- Development uses `db` for Docker communication.
- Testing uses `localhost` for local PostgreSQL.
- Production uses `db` for Docker Compose or a production containerized setup.

If you always run PostgreSQL in Docker (even for testing), you can standardize on `db` across environments. However, using `localhost` for testing is common for flexibility, especially during manual or CI/CD testing outside Docker.

Let me know if you'd like to adjust your configuration further!

# 2nd Pass ✅

## Port Mapping Recap ✅

<aside>
🗺️

1. **Database Ports**:
    - **Dev (Docker)**: Host `5433` → Container `5432`
    - **Prod (Docker)**: Host `5434` → Container `5432`
    - **Test / Local:** Host `5432`
2. **App Ports**:
    - **Dev**: Host `3001` → Container `3000`
    - **Prod**: Host `3002` → Container `3000`
    - **Test / Local**: Host `3000`
</aside>

## new envs dev / prod / test / local ✅

`.env.dev`

```tsx
PORT=3001
POSTGRES_USER=bookclub_dev_db
POSTGRES_PASSWORD=w3+1izUIvCx0AQ
POSTGRES_DB=bookclub_dev_db
POSTGRES_HOST=bookclub_dev_db
POSTGRES_PORT=5432
NODE_ENV=development
JWT_SECRET=wApNoNAUuAFcpILJTp3AwTt6EcAanKGYTZruG+/rOK8
```

`.env.local`

```tsx
PORT=3000
POSTGRES_USER=bookclub_test_db
POSTGRES_PASSWORD=zedikmOlF3WZFw
POSTGRES_DB=bookclub_test_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
NODE_ENV=local
JWT_SECRET=WjgBynULt5mJS1sxjVo1045VLmiYjza6m/dSKTYyTwA

```

`.env.prod`

```tsx
PORT=3002
POSTGRES_USER=bookclub_prod_db
POSTGRES_PASSWORD=ds+YmFGf+V9nJw
POSTGRES_DB=bookclub_prod_db
POSTGRES_HOST=bookclub_prod_db
POSTGRES_PORT=5432
NODE_ENV=production
JWT_SECRET=gSdiKdj6aVoOBxkjOJE6cOSvqu8lt5TmUYPA8jmB+

```

`.env.test`

```tsx
PORT=3000
POSTGRES_USER=bookclub_test_db
POSTGRES_PASSWORD=zedikmOlF3WZFw
POSTGRES_DB=bookclub_test_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
NODE_ENV=test
JWT_SECRET=WjgBynULt5mJS1sxjVo1045VLmiYjza6m/dSKTYyTwA

```

## Check/update env.ts  ✅

`config/env.ts`

```tsx
import dotenv from "dotenv";

const envFile = (() => {
  switch (process.env.NODE_ENV) {
    case "production":
      return ".env.prod";
    case "test":
      return ".env.test";
    case "local":
      return ".env.local";
    default:
      return ".env.dev";
  }
})();

dotenv.config({ path: envFile });

export const config = {
  port: process.env.PORT,
  db: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV,
};

```

## Check/update [init-database.sh](http://init-database.sh) ✅

```tsx
#!/bin/bash
set -e

# Connect to the default database 'postgres' and create the required databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE news_app_db;
    CREATE DATABASE news_app_test;
EOSQL

```

## Check/update package.json ✅

```tsx
{
  "name": "book-club-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    **"dev": "docker compose -f docker-compose.dev.yml --env-file .env.dev up --build",
    "prod": "docker compose -f docker-compose.prod.yml --env-file .env.prod up --build",
    "start": "node dist/index.js",
    "stop:": "docker compose down -v",
    "start:local": "NODE_ENV=local tsx src/index.ts",**
    "test": "NODE_ENV=test jest --verbose",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage",
    "build": "tsc",
    "migrate": "ts-node src/migrations/run.ts"
  },
  "dependencies": {
    "argon2": "^0.41.1",
    "dotenv": "^16.4.7",
    "eslint-define-config": "^2.1.0",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.13.1",
    "reflect-metadata": "^0.1.14",
    "typeorm": "^0.3.20",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.14",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^20.17.10",
    "@types/supertest": "^6.0.2",
    "@typescript-eslint/eslint-plugin": "^8.18.0",
    "@typescript-eslint/parser": "^8.18.0",
    "eslint": "^9.17.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-prettier": "^5.2.1",
    "jest": "^29.7.0",
    "madge": "^8.0.0",
    "prettier": "^3.4.2",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "tsconfig-paths": "^4.2.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  },
  "engines": {
    "pnpm": ">=8.0.0"
  }
}

```

## Separate docker-compose into two, dev vs prod: ✅

`docker-compose.dev.yml`

```
services:
  app:
    container_name: **bookclub_dev_app**
    **restart: on-failure:3**
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - **"3001:3000"**
    env_file:
      - **.env.dev**
    **depends_on:
      db:
        condition: service_healthy**

  db:
    container_name: **bookclub_dev_db**
    image: postgres:17-alpine
    **restart: on-failure:3**
    ports:
      - **"5433:5432"**
    env_file:
      - **.env.dev**
    volumes:
      - **postgres_data_dev**:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U $POSTGRES_USER -d $POSTGRES_DB" ]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  **postgres_data_dev:**

```

`docker-compose.prod.yml`

```
services:
  app:
    container_name: **bookclub_prod_app
    restart: on-failure:3**
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - **"3002:3000"**
    env_file:
      - **.env.prod
    depends_on:
      db:
        condition: service_healthy**

  db:
    container_name: **bookclub_prod_db**
    image: postgres:17-alpine
    restart: on-failure:3
    ports:
      - **"5434:5432"**
    env_file:
      - **.env.prod**
    volumes:
      **- postgres_data_prod**:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U $POSTGRES_USER -d $POSTGRES_DB" ]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  **postgres_data_prod:**

```

## Update Docker file ✅

- + set node to latest version!!! = 20

```docker
**FROM node:20-alpine**

WORKDIR /usr/src/app

**RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile**

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
```

## Check/update env.ts ✅

```tsx
import dotenv from "dotenv";

**const envFile = (() => {
  switch (process.env.NODE_ENV) {
    case "production":
      return ".env.prod";
    case "test":
      return ".env.test";
    case "local":
      return ".env.local";
    default:
      return ".env.dev";
  }
})();**

dotenv.config({ path: envFile });

export const config = {
  port: process.env.PORT,
  db: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV,
};

```