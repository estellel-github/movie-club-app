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

router.get("/", validate(undefined, movieFilterSchema), getAllMovies);
router.get("/:id", validate(undefined, movieReqSchema), getMovieById);

router.post(
  "/",
  authenticate,
  validate(createMovieSchema),
  authorizeRole(["admin", "host"]),
  createMovie,
);

router.patch(
  "/:id",
  authenticate,
  validate(updateMovieSchema, movieReqSchema),
  authorizeRole(["admin", "host"]),
  updateMovie,
);

router.delete(
  "/:id",
  authenticate,
  validate(undefined, movieReqSchema),
  authorizeRole(["admin", "host"]),
  deleteMovie,
);

export default router;
