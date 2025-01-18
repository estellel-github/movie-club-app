import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { userRoles, userStatuses } from "../models/user.entity.js";

const userService = new UserService();

// Suspend User
export const suspendUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.status === userStatuses[1]) {
      return res.status(400).json({ error: "User already suspended" });
    }

    const updatedUser = await userService.updateUser(userId, {
      status: "suspended",
    });

    res.status(200).json({
      message: "User suspended successfully",
      userId: updatedUser.user_id,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};

// Update User Roles
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = userRoles;
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await userService.updateUser(userId, { role });

    res.status(200).json({
      message: "Role updated successfully",
      userId: updatedUser.user_id,
      role: updatedUser.role,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};
