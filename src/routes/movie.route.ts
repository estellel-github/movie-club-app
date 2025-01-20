import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware.js";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "@/controllers/movie.controller.js";
import { validate } from "@/middleware/validation.middleware.js";
import {
  createMovieSchema,
  updateMovieSchema,
} from "@/validators/movie.validator.js";

const router = Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);

router.post("/", authenticate, validate(createMovieSchema), createMovie);
router.patch("/:id", authenticate, validate(updateMovieSchema), updateMovie);
router.delete("/:id", authenticate, deleteMovie);

export default router;
