import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeUserAction } from "../middleware/permissions.middleware.js";
import {
  createRSVP,
  updateRSVP,
  getFilteredRSVPs,
} from "../controllers/rsvp.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  updateRSVPBodySchema,
  rsvpFilterSchema,
  createRSVPBodySchema,
  RSVPReqSchema,
} from "../validators/rsvp.validator.js";

const router = Router();

router.get("/", authenticate, validate(rsvpFilterSchema), getFilteredRSVPs);

router.post(
  "/:target_user_id/:event_id",
  authorizeUserAction,
  validate(createRSVPBodySchema, RSVPReqSchema),
  authenticate,
  createRSVP,
);

router.patch(
  "/:target_user_id/:event_id",
  authorizeUserAction,
  validate(updateRSVPBodySchema, RSVPReqSchema),
  authenticate,
  updateRSVP,
);

export default router;
