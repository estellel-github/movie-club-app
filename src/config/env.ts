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
