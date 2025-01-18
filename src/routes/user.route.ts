import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/user.controller.js";

const router = Router();

// Get user profile
router.get("/", authenticate, getUserProfile);

// Update user profile
router.patch("/update", authenticate, updateUserProfile);

// Delete user account
router.delete("/delete", authenticate, deleteUserAccount);

export default router;
