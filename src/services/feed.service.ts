import { AppDataSource } from "@/config/database.js";
import { ActivityLog } from "@/models/activity.entity.js";
import { CustomError } from "@/utils/customError.js";

export class FeedService {
  private activityLogRepo = AppDataSource.getRepository(ActivityLog);

  // Fetch all activity logs
  async getActivityFeed() {
    try {
      const activities = await this.activityLogRepo.find({
        order: { created_at: "DESC" },
      });

      return activities;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve events", 500);
    }
  }
}
