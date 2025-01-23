import type { Request, Response, NextFunction } from "express";
import { FeedService } from "../services/feed.service.js";
import { CustomError } from "../utils/customError.js";
import type { ActivityType } from "../models/activity.entity.js";

const feedService = new FeedService();

export const getActivityFeed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page = 1, limit = 10, type, user_id, event_id, search } = req.query;

    const result = await feedService.getFilteredActivityFeed(
      Number(page),
      Number(limit),
      {
        type: type as ActivityType,
        user_id: user_id as string,
        event_id: event_id as string,
        search: search as string,
      },
    );

    res.status(200).json(result);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to retrieve activity feed", 500),
    );
  }
};
