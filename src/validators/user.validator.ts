import { z } from "zod";

export const userIdReqSchema = z.object({
  target_user_id: z.string().uuid("Invalid user ID format"),
});

export const updateUserProfileSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  intro_msg: z.string().optional(),
});
