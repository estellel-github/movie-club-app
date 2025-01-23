import { Router } from "express";
import {
  generateResetToken,
  resetPassword,
} from "../controllers/auth.controller.js";
import { register, login } from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", loginRateLimiter, validateBody(loginSchema), login);

router.post("/reset-token", generateResetToken);
router.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  resetPassword,
);

export default router;
