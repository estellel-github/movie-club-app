import { z } from "zod";

// Create Movie schema
export const baseMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character long")
    .max(255, "Title must not exceed 255 characters"),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters"),
  director: z
    .string()
    .min(3, "Director name must be at least 3 characters long")
    .max(255, "Director name must not exceed 255 characters"),
  release_year: z
    .number()
    .min(1900, "Release year must be a valid year")
    .max(new Date().getFullYear(), "Release year cannot be in the future"),
  genre: z
    .string()
    .min(3, "Genre must be at least 3 characters long")
    .max(50, "Genre must not exceed 50 characters"),
  language: z
    .string()
    .min(2, "Language must be at least 2 characters long")
    .max(50, "Language must not exceed 50 characters"),
  runtime_minutes: z
    .number()
    .min(1, "Runtime must be at least 1 minute")
    .max(1000, "Runtime cannot exceed 1000 minutes"),
});

// Create Movie schema (required fields)
export const createMovieSchema = baseMovieSchema;

// Update Movie schema (optional fields)
export const updateMovieSchema = baseMovieSchema.partial();
