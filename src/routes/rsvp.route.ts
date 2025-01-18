import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createRSVP,
  getRSVPsForEvent,
  updateRSVP,
  deleteRSVP,
} from "../controllers/rsvp.controller.js";

const router = Router();

// Protected routes
router.post("/:id", authenticate, createRSVP); // RSVP to an event
router.get("/:id", authenticate, getRSVPsForEvent); // Get RSVPs for an event
router.patch("/:id", authenticate, updateRSVP); // Update RSVP status
router.delete("/:id", authenticate, deleteRSVP); // Delete RSVP

export default router;
