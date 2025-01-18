import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import type { Server } from "http";
import "reflect-metadata";

import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import movieRoutes from "./routes/movie.route.js";
import eventRoutes from "./routes/event.route.js";
import rsvpRoutes from "./routes/rsvp.route.js";
import commentRoutes from "./routes/comment.route.js";
import healthRoutes from "./routes/health.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/health", healthRoutes);

// Start server and connect to the database
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await connectDB();

      const server: Server = app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server running at http://localhost:${PORT}`);
      });

      server.on("error", (error: any) => {
        if (error.code === "EADDRINUSE") {
          console.error(
            `❌ Port ${PORT} is already in use. Choose a different port.`,
          );
        } else if (error.code === "EACCES") {
          console.error(
            `❌ Permission denied. Unable to bind to port ${PORT}.`,
          );
        } else {
          console.error("❌ Server encountered an error:", error);
        }
        process.exit(1);
      });
    } catch (error) {
      console.error("Server encountered an error:", error);
      process.exit(1);
    }
  })();
}
