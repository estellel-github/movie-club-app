import { Router } from "express";
import { getActivityFeed } from "@/controllers/feed.controller.js";
import { authenticate } from "@/middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getActivityFeed);

export default router;
