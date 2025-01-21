import dotenv from "dotenv";

// Requires rechecking
const envFile = (() => {
  switch (process.env.NODE_ENV) {
    case "production":
      return ".env";
    case "test":
      return ".env";
    case "local":
      return ".env";
    default:
      return ".env";
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
