import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "./env.js";

import { User } from "../entities/User.js";
import { Book } from "../entities/Book.js";
import { Event } from "../entities/Event.js";
import { RSVP } from "../entities/RSVP.js";
import { EventComment } from "../entities/EventComment.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  entities: [User, Book, Event, RSVP, EventComment],
  synchronize: config.env === "development",
  logging: config.env === "development",
});

export const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await AppDataSource.initialize();
      console.log(`Database connected: ${config.db.name}`);
      break;
    } catch (error) {
      console.error(
        `Database connection failed. Error: ${error}. Retrying... (${retries} retries left)`,
      );
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
    }
  }
  if (!retries) process.exit(1);
};
