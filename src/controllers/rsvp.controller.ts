import type { Request, Response, NextFunction } from "express";
import { RSVPService } from "@/services/rsvp.service.js";
import { CustomError } from "@/utils/customError.js";

const rsvpService = new RSVPService();

export const createRSVP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("Incoming request to RSVP:", req.params.id);

    const { id: event_id } = req.params;

    if (!req.user || !req.user.user_id) {
      throw new CustomError("Unauthorized: User not authenticated", 401);
    }

    const { user_id } = req.user; // Auth middleware adds user_id

    const rsvp = await rsvpService.createRSVP(event_id, user_id);
    res.status(201).json(rsvp);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to create RSVP", 500),
    );
  }
};

export const getRSVPsForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: event_id } = req.params;
    const rsvps = await rsvpService.getRSVPsForEvent(event_id);
    res.status(200).json(rsvps);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to retrieve RSVPs", 500),
    );
  }
};

export const updateRSVP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: rsvp_id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new CustomError("Status is required to update RSVP", 400);
    }

    const rsvp = await rsvpService.updateRSVP(rsvp_id, status);
    res.status(200).json(rsvp);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to update RSVP", 500),
    );
  }
};
