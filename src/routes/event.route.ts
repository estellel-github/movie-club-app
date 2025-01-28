import { Router } from "express";
import {
  getAllEvents,
  getAllPublicEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createEventSchema,
  eventFilterSchema,
  eventReqSchema,
  updateEventSchema,
} from "../validators/event.validator.js";
import { validate } from "../middleware/validation.middleware.js";
import { authorizeRole } from "../middleware/permissions.middleware.js";

const router = Router();

// Public route (without sensitive fields)
router.get("/public", validate(eventFilterSchema), getAllPublicEvents);

// Private route (with all details)
router.get("/", authenticate, validate(eventFilterSchema), getAllEvents);

router.get("/:id", getEventById);

router.post(
  "/",
  authenticate,
  validate(createEventSchema),
  authorizeRole(["admin", "host"]),
  createEvent,
);
router.patch(
  "/:id",
  authenticate,
  validate(updateEventSchema, eventReqSchema),
  authorizeRole(["admin", "host"]),
  updateEvent,
);
router.delete(
  "/:id",
  authenticate,
  validate(undefined, eventReqSchema),
  authorizeRole(["admin", "host"]),
  deleteEvent,
);

export default router;
