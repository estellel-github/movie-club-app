import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", authenticate, getUserProfile);

router.patch("/update", authenticate, updateUserProfile);

router.delete("/delete", authenticate, deleteUserAccount);

export default router;
