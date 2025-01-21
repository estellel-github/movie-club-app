import { Worker } from "bullmq";
import type { Job } from "bullmq";
import { redisConfig } from "@/config/redis.js";
import { RSVPService } from "@/services/rsvp.service.js";
import { CustomError } from "@/utils/customError.js";

const rsvpService = new RSVPService();

export const rsvpWorker = new Worker(
  "rsvpQueue",
  async (job: Job) => {
    const event_id = job.data?.event_id;

    try {
      if (!event_id) {
        throw new CustomError("Job data missing event_id", 400);
      }

      console.log(`Processing waitlist for event: ${event_id}`);
      await rsvpService.processWaitlistForEvent(event_id);
    } catch (error: any) {
      throw new CustomError(
        `Failed to process waitlist for event ${event_id}: ${error.message}`,
        500,
      );
    }
  },
  { connection: redisConfig },
);

rsvpWorker.on("completed", (job: Job) => {
  console.log(`Job completed for event: ${job.data?.event_id}`);
});

rsvpWorker.on("failed", (job: Job | undefined, err: Error) => {
  if (job) {
    throw new CustomError(
      `Job failed for event: ${job.data?.event_id} with error: ${err.message}`,
      500,
    );
  } else {
    throw new CustomError(
      `Job failed with unknown details: ${err.message}`,
      500,
    );
  }
});
