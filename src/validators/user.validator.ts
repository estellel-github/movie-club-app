import { z } from "zod";

export const userIdReqSchema = z.object({
  target_user_id: z.string().uuid("Invalid user ID format"),
});

export const updateUserProfileSchema = z.object({
  email: z.string().email().optional(),
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
