import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt.js";
import { CustomError } from "@/utils/customError.js";

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

    req.user = decoded as { user_id: string; role: string };
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
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
