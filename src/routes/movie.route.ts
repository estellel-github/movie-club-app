import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createMovieSchema,
  movieFilterSchema,
  updateMovieSchema,
} from "../validators/movie.validator.js";
import { authorize } from "../middleware/permissions.middleware.js";

const router = Router();

router.get("/", validate(movieFilterSchema), getAllMovies);
router.get("/:id", getMovieById);

router.post(
  "/",
  authenticate,
  authorize(["admin", "host"]),
  validate(createMovieSchema),
  createMovie,
);

router.patch(
  "/:id",
  authenticate,
  authorize(["admin", "host"]),
  validate(updateMovieSchema),
  updateMovie,
);

router.delete("/:id", authenticate, authorize(["admin", "host"]), deleteMovie);

export default router;
