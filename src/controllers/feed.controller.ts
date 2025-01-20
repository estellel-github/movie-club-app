import type { Request, Response, NextFunction } from "express";
import { FeedService } from "../services/feed.service.js";
import { CustomError } from "../utils/customError.js";

const feedService = new FeedService();

export const getActivityFeed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activities = await feedService.getActivityFeed();
    res.status(200).json(activities);
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Error", 500));
  }
};
