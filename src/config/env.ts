import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.prod"
    : process.env.NODE_ENV === "test"
      ? ".env.test"
      : process.env.NODE_ENV === "local"
        ? ".env.local"
        : ".env";

console.log(`🌱 Using environment config: ${envFile}`);

const result = dotenv.config({ path: envFile });
if (result.error) {
  console.warn(`⚠️  Failed to load environment file: ${envFile}`);
}

const requiredVars = [
  "POSTGRES_HOST",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "JWT_SECRET",
];
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

export const config = {
  port: process.env.PORT || 3000,
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
