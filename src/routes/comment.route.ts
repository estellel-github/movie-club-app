import { Router } from "express";
import {
  authenticate,
  authorizeUserAction,
} from "../middleware/auth.middleware.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  commentFilterSchema,
  createCommentSchema,
  updateCommentSchema,
} from "../validators/comment.validator.js";

const router = Router();

router.get("/", authenticate, validate(commentFilterSchema), getComments);

router.post(
  "/:target_user_id/:event_id",
  authenticate,
  authorizeUserAction,
  validate(createCommentSchema),
  createComment,
);
router.patch(
  "/:target_user_id/:comment_id",
  authenticate,
  authorizeUserAction,
  validate(updateCommentSchema),
  updateComment,
);
router.delete(
  "/:target_user_id/:comment_id",
  authenticate,
  authorizeUserAction,
  deleteComment,
);

export default router;
