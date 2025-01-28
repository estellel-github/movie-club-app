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
    try {
      const activityLog = this.activityLogRepo.create({
        type,
        details,
        user_id: user_id || null,
        event_id: event_id || null,
        created_at: new Date(),
      });

      await this.activityLogRepo.save(activityLog);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to log activity", 500);
    }
  }

  async logUserJoin(userId: string, userName: string): Promise<void> {
    const details = `'${userName}' has joined the club.`;
    await this.logActivity(activityTypes[0], details, userId, undefined);
  }

  async logEventCreated(eventId: string, eventTitle: string): Promise<void> {
    const details = `Event '${eventTitle}' has been created.`;
    await this.logActivity(activityTypes[1], details, undefined, eventId);
  }

  async logEventUpdated(eventId: string, eventTitle: string): Promise<void> {
    const details = `Event '${eventTitle}' has been edited.`;
    await this.logActivity(activityTypes[2], details, undefined, eventId);
  }

  async logRSVPUpdate(
    event_id: string,
    user_id: string,
    status: string,
    username: string,
    eventTitle: string,
  ): Promise<void> {
    const details = `${username} now has the RSVP ${status} for event "${eventTitle}"`;
    await this.logActivity(activityTypes[4], details, user_id, event_id);
  }

  async logCommentAdded(
    event_id: string,
    user_id: string,
    comment: string,
    username: string,
    eventTitle: string,
  ): Promise<void> {
    const details = `${username} added a comment on event "${eventTitle}": "${comment}"`;
    await this.logActivity(activityTypes[3], details, user_id, event_id);
  }

  async logMovieCreated(movieId: string, movieName: string): Promise<void> {
    const details = `${movieName} has been added to the movie collection.`;
    await this.logActivity(activityTypes[5], details, undefined, movieId);
  }
}
