import { z } from "zod";
import { rsvpStatuses } from "../models/rsvp.entity.js";

export const rsvpStatus = z
  .enum(rsvpStatuses)
  .refine((val) => rsvpStatuses.includes(val!), {
    message: "Invalid RSVP status",
  });

export const createRSVPBodySchema = z.object({
  status: rsvpStatus,
});

export const RSVPReqSchema = z.object({
  event_id: z.string().uuid("Invalid Event ID format"),
  target_user_id: z.string().uuid("Invalid User ID format"),
});

export const updateRSVPBodySchema = z.object({
  status: rsvpStatus,
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
    z.enum(rsvpStatuses, {
      message: "Invalid RSVP status",
    }),
    z.undefined(),
    z.null(),
  ]),
});
