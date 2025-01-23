import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createRSVP,
  getRSVPsForEvent,
  updateRSVP,
} from "../controllers/rsvp.controller.js";
import { validateBody } from "../middleware/validation.middleware.js";
import {
  createRSVPSchema,
  updateRSVPSchema,
} from "../validators/rsvp.validator.js";

const router = Router();

router.get("/:id", authenticate, getRSVPsForEvent);

router.post("/:id", validateBody(createRSVPSchema), authenticate, createRSVP);

router.patch("/:id", validateBody(updateRSVPSchema), authenticate, updateRSVP);

export default router;
