import type { Response } from "express";
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
  req: UserRequest & { body: UpdateUserBody },
  res: Response,
  next: Function,
) => {
  try {
    const { user_id: requestingUserId, role } = req.user!;
    const { user_id: targetUserId } = req.params;

    if (!targetUserId) {
      throw new CustomError("Target user ID not provided", 400); // Bad Request
    }

    // Ensure only the target user or admin can update the profile
    if (requestingUserId !== targetUserId && role !== "admin") {
      throw new CustomError("Unauthorized to update this user's profile", 403);
    }

    const targetUser = await userService.getUserById(targetUserId);

    if (!targetUser) {
      throw new CustomError("Target user not found", 404); // Not Found
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new CustomError("Request body is missing or empty", 400); // Bad Request
    }

    const updatedUser = await userService.updateUser(targetUserId, req.body);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to update user profile", 500),
    );
  }
};

// Delete User Account
export const deleteUserAccount = async (
  req: UserRequest,
  res: Response,
  next: Function,
) => {
  try {
    const { user_id: requestingUserId, role } = req.user!;
    const { user_id: targetUserId } = req.params;

    if (!targetUserId) {
      throw new CustomError("Target user ID not provided", 400); // Bad Request
    }

    // Ensure only the target user or admin can delete the profile
    if (requestingUserId !== targetUserId && role !== "admin") {
      throw new CustomError("Unauthorized to delete this user's account", 403);
    }

    const targetUser = await userService.getUserById(targetUserId);

    if (!targetUser) {
      throw new CustomError("Target user not found", 404); // Not Found
    }

    await userService.deleteUser(targetUserId);

    res.status(204).send();
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to delete user account", 500),
    );
  }
};
