import type { Request, Response } from "express";
import { RSVPService } from "../services/rsvp.service.js";
import type { AuthenticatedRequest } from "types/express.js";

const rsvpService = new RSVPService();

export const createRSVP = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("Incoming request to RSVP:", req.params.id);

    const { id: event_id } = req.params;

    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    const { user_id } = req.user; // Auth middleware adds user_id

    const rsvp = await rsvpService.createRSVP(event_id, user_id);
    res.status(201).json(rsvp);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const getRSVPsForEvent = async (req: Request, res: Response) => {
  try {
    const { id: event_id } = req.params;
    const rsvps = await rsvpService.getRSVPsForEvent(event_id);
    res.status(200).json(rsvps);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const updateRSVP = async (req: Request, res: Response) => {
  try {
    const { id: rsvp_id } = req.params;
    const { status } = req.body;

    const rsvp = await rsvpService.updateRSVP(rsvp_id, status);
    res.status(200).json(rsvp);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const deleteRSVP = async (req: Request, res: Response) => {
  try {
    const { id: rsvp_id } = req.params;

    await rsvpService.deleteRSVP(rsvp_id);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};
