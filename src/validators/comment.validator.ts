import { z } from "zod";

// Create Comment schema
export const createCommentSchema = z.object({
  event_id: z.string().min(1, "Event ID is required"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(250, "Content must not exceed 1000 characters"),
  user_id: z.string().min(1, "User ID is required"),
});

// Update Comment schema
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(250, "Content must not exceed 1000 characters"),
});
