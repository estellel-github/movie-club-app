import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { Event } from "../models/event.entity.js";
import { CustomError } from "../utils/customError.js";

export class EventService {
  private eventRepo: Repository<Event>;

  constructor() {
    this.eventRepo = AppDataSource.getRepository(Event);
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      return await this.eventRepo.find();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve events", 500);
    }
  }

  async getEventById(event_id: string): Promise<Event | null> {
    try {
      const event = await this.eventRepo.findOneBy({ event_id });
      if (!event) {
        throw new CustomError("Event not found", 404);
      }
      return event;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve event", 500);
    }
  }

  async createEvent(data: Partial<Event>): Promise<Event> {
    try {
      const event = this.eventRepo.create(data);
      return await this.eventRepo.save(event);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to create event", 500);
    }
  }

  async updateEvent(event_id: string, data: Partial<Event>): Promise<Event> {
    try {
      const event = await this.eventRepo.findOneBy({ event_id });
      if (!event) {
        throw new CustomError("Event not found", 404);
      }

      Object.assign(event, data);
      return await this.eventRepo.save(event);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update event", 500);
    }
  }

  async deleteEvent(event_id: string): Promise<void> {
    try {
      const result = await this.eventRepo.delete(event_id);
      if (result.affected === 0) {
        throw new CustomError("Event not found", 404);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete event", 500);
    }
  }
}
