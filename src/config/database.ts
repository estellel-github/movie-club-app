import { DataSource } from "typeorm";
import { config } from "./env.js";

import { User } from "../models/user.entity.js";
import { Movie } from "../models/movie.entity.js";
import { Event } from "../models/event.entity.js";
import { RSVP } from "../models/rsvp.entity.js";
import { Comment } from "../models/comment.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  entities: [User, Movie, Event, RSVP, Comment],
  synchronize: config.env === "development",
  logging: config.env === "development",
});

export const connectDB = async () => {
  let retries = 5;
  console.log("🔧 Attempting database connection...");
  while (retries) {
    try {
      await AppDataSource.initialize();
      console.log(`✅ Database connected: ${config.db.name}`);
      break;
    } catch (error) {
      console.error(`❌ Database connection failed: ${error}`);
      retries -= 1;
      console.log(`⏳ Retrying... (${retries} retries left)`);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  if (!retries) {
    console.error("❌ Database connection failed after all retries.");
    process.exit(1);
  }
};
