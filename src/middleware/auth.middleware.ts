import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt.js";
import { CustomError } from "@/utils/customError.js";
import { AppDataSource } from "@/config/database.js";
import { User } from "@/models/user.entity.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Authorization token missing or malformed", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded !== "object" || !decoded.user_id) {
      throw new CustomError("Invalid token", 403);
    }

    // Add the user data to the request
    req.user = decoded as { user_id: string; role: string };

    // Check if the user is suspended
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ user_id: req.user.user_id });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    if (user.status === "suspended") {
      throw new CustomError("Your account is suspended", 403); // Forbidden
    }

    next(); // If everything is fine, proceed to the next middleware/route handler
  } catch (error) {
    if (error instanceof CustomError) {
      next(error); // Pass the error to the error handling middleware
    } else {
      next(
        new CustomError(
          "An unexpected error occurred during authentication",
          500,
        ),
      );
    }
  }
};
