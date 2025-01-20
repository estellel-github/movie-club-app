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
  updateEventSchema,
} from "../validators/event.validator.js";
import { validate } from "../middleware/validation.middleware.js";

const router = Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.post("/", authenticate, validate(createEventSchema), createEvent);
router.patch("/:id", authenticate, validate(updateEventSchema), updateEvent);
router.delete("/:id", authenticate, deleteEvent);

export default router;
