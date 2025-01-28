import type { Repository, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { RSVP } from "../models/rsvp.entity.js";
import { Event } from "../models/event.entity.js";
import { User } from "../models/user.entity.js";
import { CustomError } from "../utils/customError.js";
import type { RSVPStatus } from "../models/rsvp.entity.js";
import { rsvpStatuses } from "../models/rsvp.entity.js";
import { ActivityLogService } from "../services/activity.service.js";
import { UserService } from "./user.service.js";

type RsvpFilters = {
  rsvp_id?: string;
  user_id?: string;
  event_id?: string;
  status?: RSVPStatus;
};

export class RSVPService {
  private rsvpRepo: Repository<RSVP>;
  private userRepo: Repository<User>;
  private eventRepo: Repository<Event>;
  private userService: UserService;
  private activityLogService: ActivityLogService;

  constructor() {
    this.rsvpRepo = AppDataSource.getRepository(RSVP);
    this.eventRepo = AppDataSource.getRepository(Event);
    this.userRepo = AppDataSource.getRepository(User);
    this.activityLogService = new ActivityLogService();
    this.userService = new UserService();
  }

  private async getHighestPriority(event_id: string): Promise<number> {
    const highestPriorityRSVP = await this.rsvpRepo.findOne({
      where: { event_id },
      order: { priority: "DESC" },
    });

    return highestPriorityRSVP?.priority || 0;
  }

  async createRSVP(event_id: string, user_id: string): Promise<RSVP> {
    try {
      const user = await this.userRepo.findOneBy({ user_id });
      const event = await this.eventRepo.findOneBy({ event_id });

      if (!event) {
        throw new CustomError("Event not found", 404);
      }
      if (!user) {
        throw new CustomError("User not found", 404);
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
      const highestPriority = await this.getHighestPriority(event_id);
      const priority = highestPriority + 1;

      const rsvp = this.rsvpRepo.create({
        event_id,
        user_id,
        status,
        priority,
      });

      await this.rsvpRepo.save(rsvp);
      await this.processWaitlistForEvent(event_id);

      const username = user.username;
      const eventTitle = event.title;

      await this.activityLogService.logRSVPUpdate(
        event_id,
        user_id,
        status,
        username,
        eventTitle,
      );

      return rsvp;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to create RSVP", 500);
    }
  }

  async getFilteredRSVPs(
    page: number,
    limit: number,
    filters: RsvpFilters,
  ): Promise<{ rsvps: RSVP[]; total: number; page: number; limit: number }> {
    try {
      const where: FindOptionsWhere<RSVP> = {};

      if (filters.user_id) {
        where.user_id = filters.user_id;
      }
      if (filters.event_id) {
        where.event_id = filters.event_id;
      }
      if (filters.status) {
        where.status = filters.status;
      }

      const [rsvps, total] = await this.rsvpRepo.findAndCount({
        where,
        order: { created_at: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        rsvps,
        total,
        page,
        limit,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve filtered RSVPs", 500);
    }
  }

  async getRSVPByUserAndEvent(
    user_id: string,
    event_id: string,
  ): Promise<RSVP | null> {
    return await this.rsvpRepo.findOneBy({ user_id, event_id });
  }

  async updateRSVP(
    user_id: string,
    event_id: string,
    status: RSVPStatus,
  ): Promise<RSVP> {
    try {
      const rsvp = await this.getRSVPByUserAndEvent(user_id, event_id);
      const user = await this.userRepo.findOneBy({ user_id });
      const event = await this.eventRepo.findOneBy({ event_id });

      if (!rsvp) {
        throw new CustomError("RSVP not found", 404);
      }
      if (!event) {
        throw new CustomError("Event not found", 404);
      }
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      if (status === rsvpStatuses[0]) {
        // "going"
        const attendeeCount = await this.rsvpRepo.countBy({
          event_id,
          status: rsvpStatuses[0],
        });

        if (attendeeCount >= event.max_attendees) {
          throw new CustomError(
            "Cannot update RSVP to 'going': Event is full",
            400,
          );
        }
      }

      const highestPriority = await this.getHighestPriority(event_id);
      rsvp.priority = highestPriority + 1;

      const previousStatus = rsvp.status;
      rsvp.status = status;

      const updatedRSVP = await this.rsvpRepo.save(rsvp);

      const username = user.username;
      const eventTitle = event.title;

      if (previousStatus !== status) {
        await this.activityLogService.logRSVPUpdate(
          event_id,
          user_id,
          status,
          username,
          eventTitle,
        );
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
    try {
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
      for (const waitlistedUser of waitlistedUsers) {
        waitlistedUser.status = rsvpStatuses[0]; // "going"
        await this.rsvpRepo.save(waitlistedUser);
        console.log(
          `User ${waitlistedUser.user_id} moved to` + rsvpStatuses[0],
        );
        const eventTitle = event.title;

        const user = await this.userService.getUserById(waitlistedUser.user_id);

        if (!user || !user.user_id || !user.username) {
          throw new CustomError("User info not found", 404);
        } else {
          // Log the movement from waitlisted to going
          await this.activityLogService.logRSVPUpdate(
            event_id,
            user.user_id,
            rsvpStatuses[0],
            user.username,
            eventTitle,
          );
        }
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to process waitlist", 500);
    }
  }
}
