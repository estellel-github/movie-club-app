import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  suspendUser,
  updateUserRole,
} from "../controllers/admin.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  updateRoleSchema,
  userIdSchema,
} from "../validators/admin.validator.js";
import { authorize } from "../middleware/permissions.middleware.js";

const router = Router();

router.patch(
  "/suspend/:userId",
  authenticate,
  authorize(["admin"]),
  validate(userIdSchema),
  suspendUser,
);
router.patch(
  "/roles/:userId",
  authenticate,
  authorize(["admin"]),
  validate(updateRoleSchema),
  updateUserRole,
);

export default router;
