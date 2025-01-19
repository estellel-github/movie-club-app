import { z } from "zod";

// Create Event schema
export const baseEventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(255, "Title must not exceed 255 characters"),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(255, "Location must not exceed 255 characters"),
  max_attendees: z
    .number()
    .min(1, "Max attendees must be at least 1")
    .max(100, "Max attendees cannot exceed 100"),
});

// Create Event schema (required fields)
export const createEventSchema = baseEventSchema;

// Update Event schema (optional fields)
export const updateEventSchema = baseEventSchema.partial();
