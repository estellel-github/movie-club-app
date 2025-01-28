import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeUserAction } from "../middleware/permissions.middleware.js";

import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  commentBodySchema,
  commentFilterSchema,
  createCommentReqSchema,
  updateCommentReqSchema,
} from "../validators/comment.validator.js";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(undefined, commentFilterSchema),
  getComments,
);

router.post(
  "/:target_user_id/:event_id",
  authenticate,
  validate(commentBodySchema, createCommentReqSchema),
  authorizeUserAction,
  createComment,
);
router.patch(
  "/:target_user_id/:comment_id",
  authenticate,
  validate(commentBodySchema, updateCommentReqSchema),
  authorizeUserAction,
  updateComment,
);
router.delete(
  "/:target_user_id/:comment_id",
  authenticate,
  validate(undefined, updateCommentReqSchema),
  authorizeUserAction,
  deleteComment,
);

export default router;
