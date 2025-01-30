import { Router } from "express";
import { getActivityFeed } from "../controllers/feed.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { activityFeedSchema } from "../validators/feed.validator.js";
const router = Router();

router.get(
  "/",
  authenticate,
  validate(undefined, activityFeedSchema),
  getActivityFeed,
);

export default router;
