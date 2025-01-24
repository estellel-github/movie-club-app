import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeUserAction } from "../middleware/permissions.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/user.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  updateUserProfileSchema,
  userIdReqSchema,
} from "../validators/user.validator.js";

const router = Router();

router.get(
  "/profile/:target_user_id",
  authenticate,
  validate(undefined, userIdReqSchema),
  getUserProfile,
);
router.patch(
  "/:target_user_id",
  authenticate,
  authorizeUserAction,
  validate(updateUserProfileSchema, userIdReqSchema),
  updateUserProfile,
);
router.delete(
  "/:target_user_id",
  authenticate,
  authorizeUserAction,
  validate(undefined, userIdReqSchema),
  deleteUserAccount,
);

export default router;
