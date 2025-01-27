import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must not exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character");

const email = z.string().email("Invalid email format");

export const registerSchema = z.object({
  email: email,
  password: strongPassword,
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must not exceed 30 characters")
    .regex(
      /^[\p{L}\p{N}_&]+$/u,
      "Username can only contain letters, numbers, underscores, and '&'",
    ),
  intro_msg: z
    .string()
    .max(255, "Intro message must not exceed 255 characters"),
});

export const loginSchema = z.object({
  email: email,
  password: z.string().min(1, "Password is required"),
});

export const updatePasswordSchema = z.object({
  email: email,
  token: z
    .string()
    .min(1, "Token is required")
    .regex(/^[a-f0-9]{64}$/i, "Invalid token format"),
  new_password: strongPassword,
});
