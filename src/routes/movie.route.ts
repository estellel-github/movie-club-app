import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller.js";
import {
  validateBody,
  validateQuery,
} from "../middleware/validation.middleware.js";
import {
  createMovieSchema,
  movieFilterSchema,
  updateMovieSchema,
} from "../validators/movie.validator.js";
import { authorize } from "../middleware/permissions.middleware.js";

const router = Router();

router.get("/", validateQuery(movieFilterSchema), getAllMovies);
router.get("/:id", getMovieById);

router.post(
  "/",
  authenticate,
  authorize(["admin", "host"]),
  validateBody(createMovieSchema),
  createMovie,
);

router.patch(
  "/:id",
  authenticate,
  authorize(["admin", "host"]),
  validateBody(updateMovieSchema),
  updateMovie,
);

router.delete("/:id", authenticate, authorize(["admin", "host"]), deleteMovie);

export default router;
