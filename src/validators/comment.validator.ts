import { z } from "zod";

export const createCommentSchema = z.object({
  event_id: z.string().min(1, "Event ID is required"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(250, "Content must not exceed 1000 characters"),
  user_id: z.string().min(1, "User ID is required"),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(250, "Content must not exceed 1000 characters"),
});

export const commentFilterSchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a positive integer").optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .optional(),
  event_id: z.string().uuid("Invalid event ID format").optional(),
  user_id: z.string().uuid("Invalid user ID format").optional(),
  search: z.string().optional(),
});
