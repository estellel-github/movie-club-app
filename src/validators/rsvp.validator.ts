import { z } from "zod";
import { rsvpStatuses } from "../models/rsvp.entity.js";

// Create RSVP schema
export const createRSVPSchema = z.object({
  event_id: z.string().uuid("Invalid Event ID format"),
  user_id: z.string().uuid("Invalid User ID format"),
  status: z.enum(rsvpStatuses).optional(), // Optional status, defaults to "going"
});

// Update RSVP schema
export const updateRSVPSchema = z.object({
  status: z
    // Allow only "Going" or "Not going" for edit
    .enum([rsvpStatuses[0], rsvpStatuses[2]])
    .optional()
    .refine((val) => rsvpStatuses.includes(val!), {
      message: "Invalid RSVP status",
    }),
});

export const rsvpFilterSchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a positive integer").optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .optional(),
  rsvp_id: z.string().uuid("Invalid RSVP ID format").optional(),
  user_id: z.string().uuid("Invalid user ID format").optional(),
  event_id: z.string().uuid("Invalid event ID format").optional(),
  status: z.union([
    z.enum(["going", "waitlisted", "not going"], {
      message: "Invalid RSVP status",
    }),
    z.undefined(),
    z.null(),
  ]),
});
