import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.js";
import type { UserRole } from "../models/user.entity.js";

export const authorizeRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.user_id) {
      throw new CustomError("Unauthorized: User not authenticated", 401);
    }

    const userRole = req.user?.role;

    if (!userRole) {
      return next(new CustomError("Unauthorized: No user role found", 403));
    }

    if (!allowedRoles.includes(userRole)) {
      return next(
        new CustomError(
          "Forbidden: You do not have the required permissions",
          403,
        ),
      );
    }

    next();
  };
};

export const authorizeUserAction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user_id: tokenUserId } = req.user!;
  const { target_user_id: paramUserId } = req.params;

  if (!tokenUserId || !paramUserId) {
    throw new CustomError("Bad request: Missing user data", 400);
  }

  if (tokenUserId !== paramUserId) {
    throw new CustomError("Forbidden: You can only modify your own data", 403);
  }

  next();
};
