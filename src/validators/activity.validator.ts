import { z } from "zod";
import { AppDataSource } from "../config/database.js";
import { Event } from "../models/event.entity.js";
import { User } from "../models/user.entity.js";
import { activityTypes } from "../models/activity.entity.js";

export const activityTypeSchema = z.enum(activityTypes, {
  message: "Invalid activity type",
});

export const detailsSchema = z.string().min(1, "Details cannot be empty");

export const userIdSchema = z
  .string()
  .uuid("Invalid user ID format")
  .refine(
    async (userId) => {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ user_id: userId });
      return user !== null;
    },
    {
      message: "User does not exist",
    },
  );

export const eventIdSchema = z
  .string()
  .uuid("Invalid event ID format")
  .refine(
    async (eventId) => {
      const eventRepo = AppDataSource.getRepository(Event);
      const event = await eventRepo.findOneBy({ event_id: eventId });
      return event !== null;
    },
    {
      message: "Event does not exist",
    },
  );

export const createActivityLogSchema = z.object({
  type: activityTypeSchema,
  details: detailsSchema,
  user_id: userIdSchema.optional(),
  event_id: eventIdSchema.optional(),
});
