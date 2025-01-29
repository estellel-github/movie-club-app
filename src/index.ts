import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import type { Server } from "http";
import "reflect-metadata";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import commentRoutes from "./routes/comment.route.js";
import eventRoutes from "./routes/event.route.js";
import feedRoutes from "./routes/feed.route.js";
import healthRoutes from "./routes/health.route.js";
import movieRoutes from "./routes/movie.route.js";
import rsvpRoutes from "./routes/rsvp.route.js";
import userRoutes from "./routes/user.route.js";
import { validateJsonBody } from "./middleware/validateJsonBody.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rsvps", rsvpRoutes);

// Error Handling
app.use(validateJsonBody);
app.use(errorHandler);

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
