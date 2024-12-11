import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME || 'bookclub_db',
  },
};

if (!config.db.user) {
  console.warn('Warning: DB_USER is not set in the .env file.');
}

if (!config.db.password) {
  console.warn('Warning: DB_PASSWORD is not set in the .env file.');
}