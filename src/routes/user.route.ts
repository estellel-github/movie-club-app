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
  userIdParamSchema,
} from "../validators/user.validator.js";

const router = Router();

router.get(
  "/profile/:target_userid",
  authenticate,
  validate(userIdParamSchema),
  getUserProfile,
);
router.patch(
  "/:target_user_id",
  authenticate,
  authorizeUserAction,
  validate(updateUserProfileSchema),
  updateUserProfile,
);
router.delete(
  "/:target_user_id",
  authenticate,
  authorizeUserAction,
  validate(userIdParamSchema),
  deleteUserAccount,
);

export default router;
