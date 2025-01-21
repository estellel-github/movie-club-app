import { Queue } from "bullmq";
import { redisConfig } from "@/config/redis.js";

export const activityLogQueue = new Queue("activityLogQueue", {
  connection: redisConfig,
});
