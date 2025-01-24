import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createRSVP,
  updateRSVP,
  getFilteredRSVPs,
} from "../controllers/rsvp.controller.js";
import {
  validateBody,
  validateQuery,
} from "../middleware/validation.middleware.js";
import {
  createRSVPSchema,
  updateRSVPSchema,
  rsvpFilterSchema,
} from "../validators/rsvp.validator.js";

const router = Router();

router.get(
  "/",
  authenticate,
  validateQuery(rsvpFilterSchema),
  getFilteredRSVPs,
);

router.post("/:id", validateBody(createRSVPSchema), authenticate, createRSVP);

router.patch("/:id", validateBody(updateRSVPSchema), authenticate, updateRSVP);

export default router;
