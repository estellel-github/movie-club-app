import type { Request, Response, NextFunction } from "express";
import { ActivityLogService } from "@/services/activity.service.js";
import { CustomError } from "@/utils/customError.js";

const activityLogService = new ActivityLogService();

export const createActivityLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { type, details, user_id, event_id } = req.body;

    await activityLogService.logActivity(type, details, user_id, event_id);

    res.status(201).json({
      message: "Activity logged successfully",
    });
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to log activity", 500),
    );
  }
};
