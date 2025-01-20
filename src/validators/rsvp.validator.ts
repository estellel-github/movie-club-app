import { z } from "zod";
import { rsvpStatuses } from "../models/rsvp.entity.js"; // Import rsvpStatuses from the entity

// Create RSVP schema
export const createRSVPSchema = z.object({
  event_id: z.string().uuid("Invalid Event ID format"), // Validate UUID
  user_id: z.string().uuid("Invalid User ID format"), // Validate UUID
  status: z.enum(rsvpStatuses).optional(), // Optional status, defaults to "going"
});

// Update RSVP schema
export const updateRSVPSchema = z.object({
  status: z.enum([rsvpStatuses[0], rsvpStatuses[2]]), // Only allow "going" or "not going" for updates
});
