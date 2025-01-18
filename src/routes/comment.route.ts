import { Router } from "express";
import {
  getCommentsByEvent,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/event/:eventId", getCommentsByEvent);
router.post("/event/:eventId", authenticate, createComment);
router.patch("/event/:eventId/:commentId", authenticate, updateComment);
router.delete("/event/:eventId/:commentId", authenticate, deleteComment);

export default router;
