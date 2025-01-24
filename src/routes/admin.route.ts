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
import { authorizeRole } from "../middleware/permissions.middleware.js";

const router = Router();

router.patch(
  "/suspend/:userId",
  authenticate,
  authorizeRole(["admin"]),
  validate(userIdSchema),
  suspendUser,
);
router.patch(
  "/roles/:userId",
  authenticate,
  authorizeRole(["admin"]),
  validate(updateRoleSchema),
  updateUserRole,
);

export default router;
