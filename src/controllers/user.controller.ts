import { Request, Response, NextFunction } from "express";
import { UserService } from "@/services/user.service.js";
import { CustomError } from "@/utils/customError.js";
import type { UpdateUserBody, UserRequest } from "@/types/express.js";
import { excludeFields } from "@/utils/excludeFields.js";

const userService = new UserService();

// Get User Profile
export const getUserProfile = async (
  req: UserRequest,
  res: Response,
  next: Function,
) => {
  try {
    const { user_id: targetUserId } = req.params;

    if (!targetUserId) {
      throw new CustomError("Target user ID not provided", 400); // Bad Request
    }

    const targetUser = await userService.getUserById(targetUserId);

    if (!targetUser) {
      throw new CustomError("Target user not found", 404); // Not Found
    }

    // Exclude sensitive information
    const userProfile = excludeFields(targetUser, ["email", "password"]);

    res.status(200).json(userProfile);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to retrieve user profile", 500),
    );
  }
};

// Update User Profile
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id: requestingUserId, role } = req.user!;
    const { user_id: targetUserId } = req.params; //
    const data = req.body;

    if (!targetUserId) {
      throw new CustomError("Target user ID not provided", 400); // Bad Request
    }

    // Check if the user is allowed to update their profile
    const updatedUser = await userService.updateUser(
      targetUserId,
      data,
      requestingUserId,
      role
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to update user profile", 500)
    );
  }
};

export const deleteUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id: requestingUserId, role } = req.user!;
    const { user_id: targetUserId } = req.params;

    if (!targetUserId) {
      throw new CustomError("Target user ID not provided", 400); // Bad Request
    }

    // Check if the user is allowed to delete their profile
    await userService.deleteUser(targetUserId, requestingUserId, role);

    res.status(204).send(); // No content, successfully deleted
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to delete user account", 500)
    );
  }
};
