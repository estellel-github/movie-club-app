import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createRSVP,
  getRSVPsForEvent,
  updateRSVP,
  deleteRSVP,
} from "../controllers/rsvp.controller.js";

const router = Router();

router.post("/:id", authenticate, createRSVP);
router.get("/:id", authenticate, getRSVPsForEvent);
router.patch("/:id", authenticate, updateRSVP);
router.delete("/:id", authenticate, deleteRSVP);

export default router;
