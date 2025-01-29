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
  movie_id: z.string().uuid("Invalid movie ID format"),
  host_id: z.string().uuid("Invalid host ID format").optional(),
  max_attendees: z
    .number()
    .min(1, "Max attendees must be at least 1")
    .max(100, "Max attendees cannot exceed 100"),
});

// Create Event schema (required fields)
export const createEventSchema = baseEventSchema;

// Update Event schema (optional fields)
export const updateEventSchema = baseEventSchema.partial();

// Regex for strict date validation (YYYY-MM-DD format)
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Filter Event schema
export const eventFilterSchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a positive integer").optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .optional(),
  title: z.string().optional(),
  dateStart: z
    .string()
    .regex(isoDateRegex, "Date must be in YYYY-MM-DD format")
    .optional(),
  dateEnd: z
    .string()
    .regex(isoDateRegex, "Date must be in YYYY-MM-DD format")
    .optional(),
  location: z.string().optional(),
});

export const eventReqSchema = z.object({
  id: z.string().uuid("Invalid Event ID format"),
});
