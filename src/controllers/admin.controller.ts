import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { userRoles } from "../models/user.entity.js";
import { CustomError } from "../utils/customError.js";

const userService = new UserService();

// Suspend User
export const suspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { target_user_id: targetUserId } = req.params;
    const { role: requestingUserRole } = req.user!;

    const updatedUser = await userService.suspendUser(
      requestingUserRole,
      targetUserId,
    );

    res.status(200).json({
      message: "User suspended successfully",
      userId: updatedUser,
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
    const { target_user_id: targetUserId } = req.params;
    const { role } = req.body;
    const { role: requesterRole } = req.user!;

    // Validate role
    if (!userRoles.includes(role)) {
      throw new CustomError("Invalid role specified", 400);
    }

    const user = await userService.getUserById(targetUserId);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const updatedUser = await userService.updateUserRole(
      requesterRole,
      targetUserId,
      role,
    );

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
