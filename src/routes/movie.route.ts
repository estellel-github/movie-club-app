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
  movieReqSchema,
  updateMovieSchema,
} from "../validators/movie.validator.js";
import { authorizeRole } from "../middleware/permissions.middleware.js";

const router = Router();

router.get("/", validate(movieFilterSchema), getAllMovies);
router.get("/:id", validate(undefined, movieReqSchema), getMovieById);

router.post(
  "/",
  authenticate,
  authorizeRole(["admin", "host"]),
  validate(createMovieSchema),
  createMovie,
);

router.patch(
  "/:id",
  authenticate,
  authorizeRole(["admin", "host"]),
  validate(updateMovieSchema, movieReqSchema),
  updateMovie,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole(["admin", "host"]),
  validate(undefined, movieReqSchema),
  deleteMovie,
);

export default router;
