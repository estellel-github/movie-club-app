import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { userRoles, userStatuses } from "../models/user.entity.js";
import { CustomError } from "../utils/customError.js";

const userService = new UserService();

// Suspend User
export const suspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    if (user.status === userStatuses[1]) {
      throw new CustomError("User already suspended", 400);
    }

    const updatedUser = await userService.updateUser(userId, {
      status: "suspended",
    });

    res.status(200).json({
      message: "User suspended successfully",
      userId: updatedUser.user_id,
    });
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to suspend user", 500),
    );
  }
};

// Update User Roles
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!userRoles.includes(role)) {
      throw new CustomError("Invalid role specified", 400);
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const updatedUser = await userService.updateUser(userId, { role });

    res.status(200).json({
      message: "Role updated successfully",
      userId: updatedUser.user_id,
      role: updatedUser.role,
    });
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to update user role", 500),
    );
  }
};
