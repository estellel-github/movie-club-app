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
import {
  validateBody,
  validateQuery,
} from "../middleware/validation.middleware.js";
import { authorize } from "../middleware/permissions.middleware.js";

const router = Router();

router.get("/", validateQuery(eventFilterSchema), getAllEvents);

router.get("/:id", getEventById);

router.post(
  "/",
  authenticate,
  authorize(["admin", "host"]),
  validateBody(createEventSchema),
  createEvent,
);
router.patch(
  "/:id",
  authenticate,
  authorize(["admin", "host"]),
  validateBody(updateEventSchema),
  updateEvent,
);
router.delete("/:id", authenticate, authorize(["admin", "host"]), deleteEvent);

export default router;
