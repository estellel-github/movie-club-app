import type { Repository } from "typeorm";
import { AppDataSource } from "@/config/database.js";
import { RSVP } from "@/models/rsvp.entity.js";
import { Event } from "@/models/event.entity.js";
import { CustomError } from "@/utils/customError.js";
import type { RSVPStatus } from "@/models/rsvp.entity.js";
import { rsvpStatuses } from "@/models/rsvp.entity.js";
import { ActivityLogService } from "@/services/activity.service.js";

export class RSVPService {
  private rsvpRepo: Repository<RSVP>;
  private eventRepo: Repository<Event>;
  private activityLogService: ActivityLogService;

  constructor() {
    this.rsvpRepo = AppDataSource.getRepository(RSVP);
    this.eventRepo = AppDataSource.getRepository(Event);
    this.activityLogService = new ActivityLogService();
  }

  async createRSVP(event_id: string, user_id: string): Promise<RSVP> {
    try {
      const event = await this.eventRepo.findOneBy({ event_id });
      if (!event) {
        throw new CustomError("Event not found", 404);
      }

      // Count current attendees with "going" status
      const attendeeCount = await this.rsvpRepo.countBy({
        event_id,
        status: rsvpStatuses[0],
      });

      // Prevent duplicate RSVPs
      const existingRSVP = await this.rsvpRepo.findOneBy({ event_id, user_id });
      if (existingRSVP) {
        throw new CustomError("User has already RSVP'd to this event", 400);
      }

      // Determine status and priority
      const status: RSVPStatus =
        attendeeCount >= event.max_attendees
          ? rsvpStatuses[1] // "waitlisted"
          : rsvpStatuses[0]; // "going"
      const priority = attendeeCount + 1;

      const rsvp = this.rsvpRepo.create({
        event_id,
        user_id,
        status,
        priority,
      });

      await this.rsvpRepo.save(rsvp);

      await this.activityLogService.logRSVPUpdate(event_id, user_id, status);

      await this.processWaitlistForEvent(event_id);

      return rsvp;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to create RSVP", 500);
    }
  }

  async getRSVPsForEvent(event_id: string): Promise<RSVP[]> {
    try {
      return await this.rsvpRepo.findBy({ event_id });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve RSVPs for the event", 500);
    }
  }

  async getRSVPById(rsvp_id: string): Promise<RSVP | null> {
    return await this.rsvpRepo.findOneBy({ rsvp_id });
  }

  async updateRSVP(rsvp_id: string, status: RSVP["status"]): Promise<RSVP> {
    try {
      const rsvp = await this.rsvpRepo.findOneBy({ rsvp_id });
      if (!rsvp) {
        throw new CustomError("RSVP not found", 404);
      }

      const previousStatus = rsvp.status;
      rsvp.status = status;

      const updatedRSVP = await this.rsvpRepo.save(rsvp);

      if (previousStatus !== status) {
        const { event_id, user_id } = rsvp;
        await this.activityLogService.logRSVPUpdate(event_id, user_id, status);
        await this.processWaitlistForEvent(event_id);
      }

      return updatedRSVP;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update RSVP", 500);
    }
  }

  async processWaitlistForEvent(event_id: string): Promise<void> {
    const event = await this.eventRepo.findOneBy({ event_id });
    if (!event) {
      throw new CustomError("Event not found", 404);
    }

    const attendeeCount = await this.rsvpRepo.countBy({
      event_id,
      status: rsvpStatuses[0],
    });

    const availableSpots = event.max_attendees - attendeeCount;
    // No spots available, no action needed
    if (availableSpots <= 0) return;

    // Get the top-priority waitlisted users
    const waitlistedUsers = await this.rsvpRepo.find({
      where: { event_id, status: rsvpStatuses[1] },
      order: { priority: "ASC" },
      take: availableSpots,
    });

    // Move waitlisted users to "going"
    for (const user of waitlistedUsers) {
      user.status = rsvpStatuses[0]; // "going"
      await this.rsvpRepo.save(user);
      console.log(`User ${user.user_id} moved to` + rsvpStatuses[0]);

      // Log the movement from waitlisted to going
      await this.activityLogService.logRSVPUpdate(
        event_id,
        user.user_id,
        rsvpStatuses[0],
      );
    }
  }
}
