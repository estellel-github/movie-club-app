import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.js";
import type { UserRole } from "../models/user.entity.js";

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
