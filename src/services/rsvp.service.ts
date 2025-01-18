import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { RSVP } from "../models/rsvp.entity.js";
import { Event } from "../models/event.entity.js";

export class RSVPService {
  private rsvpRepo: Repository<RSVP>;
  private eventRepo: Repository<Event>;

  constructor() {
    this.rsvpRepo = AppDataSource.getRepository(RSVP);
    this.eventRepo = AppDataSource.getRepository(Event);
  }

  async createRSVP(event_id: string, user_id: string): Promise<RSVP> {
    const event = await this.eventRepo.findOneBy({ event_id });
    if (!event) {
      throw new Error("Event not found");
    }

    const attendeeCount = await this.rsvpRepo.countBy({ event_id });
    if (attendeeCount >= event.max_attendees) {
      throw new Error("Event is full");
    }

    const existingRSVP = await this.rsvpRepo.findOneBy({ event_id, user_id });
    if (existingRSVP) {
      throw new Error("User has already RSVP'd to this event");
    }

    const rsvp = this.rsvpRepo.create({
      event_id,
      user_id,
      status: "going",
    });
    return this.rsvpRepo.save(rsvp);
  }

  async getRSVPsForEvent(event_id: string): Promise<RSVP[]> {
    return this.rsvpRepo.findBy({ event_id });
  }

  async updateRSVP(rsvp_id: string, status: RSVP["status"]): Promise<RSVP> {
    const rsvp = await this.rsvpRepo.findOneBy({ rsvp_id });
    if (!rsvp) {
      throw new Error("RSVP not found");
    }

    rsvp.status = status;
    return this.rsvpRepo.save(rsvp);
  }

  async deleteRSVP(rsvp_id: string): Promise<void> {
    const result = await this.rsvpRepo.delete(rsvp_id);
    if (result.affected === 0) {
      throw new Error("RSVP not found");
    }
  }
}
