import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { RSVP } from "../models/rsvp.entity.js";
import { Event } from "../models/event.entity.js";
import { CustomError } from "../utils/customError.js";

export class RSVPService {
  private rsvpRepo: Repository<RSVP>;
  private eventRepo: Repository<Event>;

  constructor() {
    this.rsvpRepo = AppDataSource.getRepository(RSVP);
    this.eventRepo = AppDataSource.getRepository(Event);
  }

  async createRSVP(event_id: string, user_id: string): Promise<RSVP> {
    try {
      const event = await this.eventRepo.findOneBy({ event_id });
      if (!event) {
        throw new CustomError("Event not found", 404);
      }

      const attendeeCount = await this.rsvpRepo.countBy({ event_id });
      if (attendeeCount >= event.max_attendees) {
        throw new CustomError("Event is full", 400);
      }

      const existingRSVP = await this.rsvpRepo.findOneBy({ event_id, user_id });
      if (existingRSVP) {
        throw new CustomError("User has already RSVP'd to this event", 400);
      }

      const rsvp = this.rsvpRepo.create({
        event_id,
        user_id,
        status: "going",
      });
      return await this.rsvpRepo.save(rsvp);
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

  async updateRSVP(rsvp_id: string, status: RSVP["status"]): Promise<RSVP> {
    try {
      const rsvp = await this.rsvpRepo.findOneBy({ rsvp_id });
      if (!rsvp) {
        throw new CustomError("RSVP not found", 404);
      }

      rsvp.status = status;
      return await this.rsvpRepo.save(rsvp);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update RSVP", 500);
    }
  }

  async deleteRSVP(rsvp_id: string): Promise<void> {
    try {
      const result = await this.rsvpRepo.delete(rsvp_id);
      if (result.affected === 0) {
        throw new CustomError("RSVP not found", 404);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete RSVP", 500);
    }
  }
}
