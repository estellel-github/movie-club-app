import { z } from "zod";
import { activityTypes } from "../models/activity.entity.js";

export const activityFeedSchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a positive integer").optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .optional(),
  type: z.enum(activityTypes).optional(),
  user_id: z.string().uuid("Invalid user ID format").optional(),
  event_id: z.string().uuid("Invalid event ID format").optional(),
  search: z.string().optional(),
});
