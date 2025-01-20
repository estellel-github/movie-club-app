import { z } from "zod";
import { userRoles } from "@/models/user.entity.js";

// Validate role change
export const updateRoleSchema = z.object({
  role: z.enum(userRoles, { message: "Invalid role specified" }),
});

// Validate userId for suspending
export const userIdSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});
