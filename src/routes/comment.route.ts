import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByEvent,
} from "../controllers/comment.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/comment.validator.js";

const router = Router();

router.get("/:event_id", getCommentsByEvent);

router.post("/", authenticate, validate(createCommentSchema), createComment);
router.patch(
  "/:comment_id",
  authenticate,
  validate(updateCommentSchema),
  updateComment,
);
router.delete("/:comment_id", authenticate, deleteComment);

export default router;
