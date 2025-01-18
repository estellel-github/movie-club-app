import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validate } from "middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
