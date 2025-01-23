import type { FindOptionsWhere } from "typeorm";
import { Like } from "typeorm";
import { AppDataSource } from "../config/database.js";
import type { ActivityType } from "../models/activity.entity.js";
import { ActivityLog } from "../models/activity.entity.js";
import { CustomError } from "../utils/customError.js";

type FeedFilters = {
  type?: ActivityType;
  user_id?: string;
  event_id?: string;
  search?: string;
};

export class FeedService {
  private activityLogRepo = AppDataSource.getRepository(ActivityLog);

  // Fetch activity feed with pagination and filters
  async getFilteredActivityFeed(
    page: number,
    limit: number,
    filters: FeedFilters,
  ): Promise<{
    activities: ActivityLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      // Define the 'where' clause with proper TypeORM typing
      const where: FindOptionsWhere<ActivityLog> = {};

      // Apply filters if provided
      if (filters.type) {
        where.type = filters.type;
      }
      if (filters.user_id) {
        where.user_id = filters.user_id;
      }
      if (filters.event_id) {
        where.event_id = filters.event_id;
      }
      if (filters.search) {
        where.details = Like(`%${filters.search}%`);
      }

      // Fetch activities and count total
      const [activities, total] = await this.activityLogRepo.findAndCount({
        where,
        order: { created_at: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        activities,
        total,
        page,
        limit,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve filtered activity feed", 500);
    }
  }
}
