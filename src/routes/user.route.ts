import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/user.controller.js";
import {
  validateBody,
  validateQuery,
} from "../middleware/validation.middleware.js";
import {
  updateUserProfileSchema,
  userIdParamSchema,
} from "../validators/user.validator.js";

const router = Router();

router.get(
  "/profile/:userid",
  authenticate,
  validateBody(userIdParamSchema),
  getUserProfile,
);
router.patch(
  "/:user_id",
  authenticate,
  validateQuery(updateUserProfileSchema),
  updateUserProfile,
);
router.delete(
  "/:user_id",
  authenticate,
  validateQuery(userIdParamSchema),
  deleteUserAccount,
);

export default router;
