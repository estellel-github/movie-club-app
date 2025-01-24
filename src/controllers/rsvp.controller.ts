import type { Request, Response, NextFunction } from "express";
import { RSVPService } from "../services/rsvp.service.js";
import { CustomError } from "../utils/customError.js";
import type { RSVPStatus } from "../models/rsvp.entity.js";

const rsvpService = new RSVPService();

export const createRSVP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("Incoming request to RSVP:", req.params.id);

    const { target_user_id: target_user_id, event_id: event_id } = req.params;

    const rsvp = await rsvpService.createRSVP(event_id, target_user_id);
    res.status(201).json(rsvp);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to create RSVP", 500),
    );
  }
};

export const getFilteredRSVPs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, rsvp_id, user_id, event_id, status } = req.query;

    const result = await rsvpService.getFilteredRSVPs(
      page ? Number(page) : 1,
      limit ? Number(limit) : 0,
      {
        rsvp_id: rsvp_id as string,
        user_id: user_id as string,
        event_id: event_id as string,
        status: status as string as RSVPStatus,
      },
    );

    res.status(200).json(result);
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
    const { target_user_id, event_id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new CustomError("Status is required to update RSVP", 400); // Bad Request
    }

    const rsvp = await rsvpService.getRSVPByUserAndEvent(
      target_user_id,
      event_id,
    );

    if (!rsvp) {
      throw new CustomError("RSVP not found", 404); // Not Found
    }

    const updatedRSVP = await rsvpService.updateRSVP(
      target_user_id,
      event_id,
      status,
    );
    res.status(200).json(updatedRSVP);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to update RSVP", 500),
    );
  }
};
