import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  suspendUser,
  updateUserRole,
} from "../controllers/admin.controller.js";

const router = Router();

router.patch("/suspend/:userId", authenticate, suspendUser);
router.patch("/roles/:userId", authenticate, updateUserRole);

export default router;
