import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
import {
  validateBody,
  validateQuery,
} from "../middleware/validation.middleware.js";
import {
  commentFilterSchema,
  createCommentSchema,
  updateCommentSchema,
} from "../validators/comment.validator.js";

const router = Router();

router.get("/", authenticate, validateQuery(commentFilterSchema), getComments);

router.post(
  "/",
  authenticate,
  validateBody(createCommentSchema),
  createComment,
);
router.patch(
  "/:comment_id",
  authenticate,
  validateBody(updateCommentSchema),
  updateComment,
);
router.delete("/:comment_id", authenticate, deleteComment);

export default router;
