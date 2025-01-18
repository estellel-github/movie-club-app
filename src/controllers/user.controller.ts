import type { Response } from "express";
import { UserService } from "../services/user.service.js";
import type { AuthenticatedRequest } from "../types/express.d.ts";

const userService = new UserService();

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  try {
    const { user_id } = req.user!;
    const user = await userService.getUserById(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const userProfile = { ...user, password: undefined };
    res.status(200).json(userProfile);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};

export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { user_id } = req.user!;
    const updatedUser = await userService.updateUser(user_id, req.body);
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const deleteUserAccount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { user_id } = req.user!;
    await userService.deleteUser(user_id);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};
