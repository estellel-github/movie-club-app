import { Router } from "express";
import {
  generateResetToken,
  updatePassword,
} from "../controllers/auth.controller.js";
import { register, login } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  resetTokenSchema,
} from "../validators/auth.validator.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", loginRateLimiter, validate(loginSchema), login);

router.post("/reset-token", validate(resetTokenSchema), generateResetToken);
router.post("/update-password", validate(updatePasswordSchema), updatePassword);

export default router;
