import { AppDataSource } from "../config/database.js";
import type { ActivityType } from "../models/activity.entity.js";
import { ActivityLog, activityTypes } from "../models/activity.entity.js";
import { CustomError } from "../utils/customError.js";

export class ActivityLogService {
  private activityLogRepo = AppDataSource.getRepository(ActivityLog);

  async logActivity(
    type: ActivityType,
    details: string,
    user_id?: string,
    event_id?: string,
  ): Promise<void> {
    const activityLog = this.activityLogRepo.create({
      type,
      details,
      user_id: user_id || null,
      event_id: event_id || null,
      created_at: new Date(),
    });

    await this.activityLogRepo.save(activityLog);
  }
  catch(error: any) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to log activity", 500);
  }

  async logUserJoin(userId: string, userName: string): Promise<void> {
    const details = `User '${userName}' has joined the club.`;
    await this.logActivity(activityTypes[0], details, userId);
  }

  async logEventCreated(eventId: string, eventName: string): Promise<void> {
    const details = `Event '${eventName}' has been created.`;
    await this.logActivity(activityTypes[1], details, undefined, eventId);
  }

  async logEventUpdated(eventId: string, eventName: string): Promise<void> {
    const details = `Event '${eventName}' has been edited.`;
    await this.logActivity(activityTypes[2], details, undefined, eventId);
  }

  async logCommentAdded(
    eventId: string,
    userId: string,
    comment: string,
  ): Promise<void> {
    const details = `User '${userId}' added a comment: '${comment}' on event '${eventId}'.`;
    await this.logActivity(activityTypes[3], details, userId, eventId);
  }

  async logRSVPUpdate(
    eventId: string,
    userId: string,
    status: string,
  ): Promise<void> {
    const details = `User '${userId}' updated RSVP to '${status}' for event '${eventId}'.`;
    await this.logActivity(activityTypes[4], details, userId, eventId);
  }

  async logMovieCreated(movieId: string, movieName: string): Promise<void> {
    const details = `Movie '${movieName}' has been added to the collection.`;
    await this.logActivity(activityTypes[5], details, undefined, movieId);
  }
}
