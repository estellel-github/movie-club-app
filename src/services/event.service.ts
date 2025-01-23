import type { Repository, FindOptionsWhere } from "typeorm";
import { Like, Between } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { Event } from "../models/event.entity.js";
import { CustomError } from "../utils/customError.js";
import { ActivityLogService } from "../services/activity.service.js";

export class EventService {
  private eventRepo: Repository<Event>;
  private activityLogService: ActivityLogService;

  constructor() {
    this.eventRepo = AppDataSource.getRepository(Event);
    this.activityLogService = new ActivityLogService();
  }

  async getEventsWithFilters(
    page: number,
    limit: number,
    filters: {
      title?: string;
      dateStart?: string;
      dateEnd?: string;
      location?: string;
    },
  ): Promise<{ events: Event[]; total: number; page: number; limit: number }> {
    try {
      const where: FindOptionsWhere<Event> = {};

      if (filters.title) {
        where.title = Like(`%${filters.title}%`);
      }
      if (filters.dateStart || filters.dateEnd) {
        where.date = Between(
          new Date(filters.dateStart || "1900-01-01"),
          new Date(filters.dateEnd || new Date().toISOString()),
        );
      }
      if (filters.location) {
        where.location = Like(`%${filters.location}%`);
      }

      const [events, total] = await this.eventRepo.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        order: { date: "ASC" },
      });

      return { events, total, page, limit };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve events with filters", 500);
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
      const savedEvent = await this.eventRepo.save(event);

      await this.activityLogService.logEventCreated(
        savedEvent.event_id,
        savedEvent.title,
      );

      return savedEvent;
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
      const updatedEvent = await this.eventRepo.save(event);

      await this.activityLogService.logEventUpdated(
        updatedEvent.event_id,
        updatedEvent.title,
      );

      // Later, optionally, track which fields were changed to include in the response
      return updatedEvent;
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
