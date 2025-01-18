import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { Event } from "../models/event.entity.js";

export class EventService {
  private eventRepo: Repository<Event>;

  constructor() {
    this.eventRepo = AppDataSource.getRepository(Event);
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepo.find();
  }

  async getEventById(event_id: string): Promise<Event | null> {
    return this.eventRepo.findOneBy({ event_id });
  }

  async createEvent(data: Partial<Event>): Promise<Event> {
    const event = this.eventRepo.create(data);
    return this.eventRepo.save(event);
  }

  async updateEvent(event_id: string, data: Partial<Event>): Promise<Event> {
    const event = await this.eventRepo.findOneBy({ event_id });
    if (!event) throw new Error("Event not found");

    Object.assign(event, data);
    return this.eventRepo.save(event);
  }

  async deleteEvent(event_id: string): Promise<void> {
    const result = await this.eventRepo.delete(event_id);
    if (result.affected === 0) throw new Error("Event not found");
  }
}
