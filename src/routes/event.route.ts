import { Router } from "express";
import {
  getAllEvents,
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

router.get("/", validate(eventFilterSchema), getAllEvents);

router.get("/:id", getEventById);

router.post(
  "/",
  authenticate,
  authorizeRole(["admin", "host"]),
  validate(createEventSchema),
  createEvent,
);
router.patch(
  "/:id",
  authenticate,
  authorizeRole(["admin", "host"]),
  validate(updateEventSchema, eventReqSchema),
  updateEvent,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRole(["admin", "host"]),
  validate(undefined, eventReqSchema),
  deleteEvent,
);

export default router;
