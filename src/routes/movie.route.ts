import { Router } from "express";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller.js";
import { authenticate } from "../middleware/auth.middleware.js"; // Auth middleware

const router = Router();

// Public routes
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// Protected routes
router.post("/", authenticate, createMovie);
router.patch("/:id", authenticate, updateMovie);
router.delete("/:id", authenticate, deleteMovie);

export default router;
