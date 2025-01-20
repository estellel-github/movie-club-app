import { Queue } from "bullmq";
import { redisConfig } from "../config/redis.js";

export const rsvpQueue = new Queue("rsvpQueue", {
  connection: redisConfig,
});
