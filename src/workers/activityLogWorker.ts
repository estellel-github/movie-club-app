import { Worker } from "bullmq";
import type { Job } from "bullmq";
import { redisConfig } from "@/config/redis.js";
import { ActivityLog } from "@/models/activity.entity.js";
import { ActivityLogService } from "@/services/activity.service.js";
import { CustomError } from "@/utils/customError.js";

const activityLogService = new ActivityLogService();

export const activityLogWorker = new Worker(
  "activityLogQueue",
  async (job: Job) => {
    const { type, details, user_id, event_id } = job.data;

    try {
      const activityLog = new ActivityLog();
      activityLog.type = type;
      activityLog.details = details;
      activityLog.user_id = user_id || null;
      activityLog.event_id = event_id || null;
      activityLog.created_at = new Date();

      // Save the activity log using the service
      await activityLogService.saveActivityLog(activityLog);
      console.log(`Activity logged: ${details}`);
    } catch (error: any) {
      throw new CustomError(`Failed to log activity: ${error.message}`, 500);
    }
  },
  { connection: redisConfig },
);
