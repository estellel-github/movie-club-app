import { Router } from "express";
import {
  authenticate,
  authorizeUserAction,
} from "../middleware/auth.middleware.js";
import {
  createRSVP,
  updateRSVP,
  getFilteredRSVPs,
} from "../controllers/rsvp.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createRSVPSchema,
  updateRSVPSchema,
  rsvpFilterSchema,
} from "../validators/rsvp.validator.js";

const router = Router();

router.get("/", authenticate, validate(rsvpFilterSchema), getFilteredRSVPs);

router.post(
  "/:target_user_id/:event_id",
  authorizeUserAction,
  validate(createRSVPSchema),
  authenticate,
  createRSVP,
);

router.patch(
  "/:target_user_id/:event_id",
  authorizeUserAction,
  validate(updateRSVPSchema),
  authenticate,
  updateRSVP,
);

export default router;
