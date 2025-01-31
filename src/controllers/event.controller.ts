import type { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event.service.js";
import { CustomError } from "../utils/customError.js";
import { excludeFields } from "../utils/excludeFields.js";

const eventService = new EventService();

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      limit = "0",
      title,
      dateStart,
      dateEnd,
      location,
    } = req.query;

    const result = await eventService.getEventsWithFilters(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      {
        title: title as string,
        dateStart: dateStart as string,
        dateEnd: dateEnd as string,
        location: location as string,
      },
    );

    res.status(200).json(result);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to retrieve events", 500),
    );
  }
};

export const getAllPublicEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      limit = "0",
      title,
      dateStart,
      dateEnd,
      location,
    } = req.query;

    const result = await eventService.getEventsWithFilters(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      {
        title: title as string,
        dateStart: dateStart as string,
        dateEnd: dateEnd as string,
        location: location as string,
      },
    );

    // Use excludeFields to remove `location` and `host`
    const publicEvents = result.events.map((event) =>
      excludeFields(event, ["location", "host_id"]),
    );

    res.status(200).json({
      ...result,
      events: publicEvents,
    });
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to retrieve public events", 500),
    );
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      throw new CustomError("Event not found", 404);
    }
    res.status(200).json(event);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to retrieve the event", 500),
    );
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to create the event", 500),
    );
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.status(200).json(event);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to update the event", 500),
    );
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to delete the event", 500),
    );
  }
};
