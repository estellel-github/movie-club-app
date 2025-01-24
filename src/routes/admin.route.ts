import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  suspendUser,
  updateUserRole,
} from "../controllers/admin.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  updateRoleSchema,
  userReqSchema,
} from "../validators/admin.validator.js";
import { authorizeRole } from "../middleware/permissions.middleware.js";

const router = Router();

router.patch(
  "/suspend/:target_user_id",
  authenticate,
  authorizeRole(["admin"]),
  validate(undefined, userReqSchema),
  suspendUser,
);
router.patch(
  "/roles/:target_user_id",
  authenticate,
  authorizeRole(["admin"]),
  validate(updateRoleSchema, userReqSchema),
  updateUserRole,
);

export default router;
