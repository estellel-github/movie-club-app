import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "@/controllers/user.controller.js";
import { validate } from "middleware/validation.middleware.js";
import {
  updateUserProfileSchema,
  userIdParamSchema,
} from "validators/user.validator.js";

const router = Router();

router.get(
  "/profile/:userid",
  authenticate,
  validate(userIdParamSchema),
  getUserProfile,
);
router.patch(
  "/update",
  authenticate,
  validate(updateUserProfileSchema),
  updateUserProfile,
);
router.delete(
  "/delete",
  authenticate,
  validate(userIdParamSchema),
  deleteUserAccount,
);

export default router;
