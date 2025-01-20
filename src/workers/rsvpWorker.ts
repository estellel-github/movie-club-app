import type { Job } from "bullmq";
import { Worker } from "bullmq";
import { redisConfig } from "@/config/redis.js";
import { RSVPService } from "@/services/rsvp.service.js";

const rsvpService = new RSVPService();

export const rsvpWorker = new Worker(
  "rsvpQueue", // The name of the queue
  async (job: Job) => {
    const event_id = job.data?.event_id;
    if (event_id) {
      console.log(`Processing waitlist for event: ${event_id}`);
      await rsvpService.processWaitlistForEvent(event_id);
    } else {
      console.error("Job data missing event_id");
    }
  },
  { connection: redisConfig }, // Redis connection
);

rsvpWorker.on("completed", (job: Job) => {
  console.log(`Job completed for event: ${job.data?.event_id}`);
});

rsvpWorker.on("failed", (job: Job | undefined, err: Error) => {
  if (job) {
    console.error(`Job failed for event: ${job.data?.event_id}`, err);
  } else {
    console.error("Job failed with unknown details", err);
  }
});
