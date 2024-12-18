import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import "reflect-metadata";

import adminRoutes from "./modules/admin/route.js";
// import authRoutes from "./modules/auth/route.js";
import userRoutes from "./modules/user/route.js";
import bookRoutes from "./modules/book/route.js";
import eventRoutes from "./modules/event/route.js";
import rsvpRoutes from "./modules/rsvp/route.js";
import commentRoutes from "./modules/comment/route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
// app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/comments", commentRoutes);

// Start server and connect to the database
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await connectDB();

      const server = app.listen(PORT, () => {
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
