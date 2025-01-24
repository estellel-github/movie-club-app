import { z } from "zod";

export const commentBodySchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content is too long"),
});

export const createCommentReqSchema = z.object({
  event_id: z.string().uuid("Invalid event ID format"),
  target_user_id: z.string().uuid("Invalid user ID format"),
});

export const updateCommentReqSchema = z.object({
  comment_id: z.string().uuid("Invalid event ID format"),
  target_user_id: z.string().uuid("Invalid user ID format"),
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
