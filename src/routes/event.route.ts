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
  updateEventSchema,
} from "../validators/event.validator.js";
import { validate } from "../middleware/validation.middleware.js";
import { authorize } from "../middleware/permissions.middleware.js";

const router = Router();

router.get("/", validate(eventFilterSchema), getAllEvents);

router.get("/:id", getEventById);

router.post(
  "/",
  authenticate,
  authorize(["admin", "host"]),
  validate(createEventSchema),
  createEvent,
);
router.patch(
  "/:id",
  authenticate,
  authorize(["admin", "host"]),
  validate(updateEventSchema),
  updateEvent,
);
router.delete("/:id", authenticate, authorize(["admin", "host"]), deleteEvent);

export default router;
