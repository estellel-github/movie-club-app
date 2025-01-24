import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { CustomError } from "../utils/customError.js";

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

    try {
      // This will throw an error if the token is expired or invalid
      const decoded = verifyToken(token);

      if (!decoded || typeof decoded !== "object" || !decoded.user_id) {
        throw new CustomError("Invalid token", 403); // Forbidden
      }

      req.user = decoded as { user_id: string; role: string }; // Attach user to request
      next();
    } catch (error: any) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        if (error.name === "TokenExpiredError") {
          return next(new CustomError("Token expired", 401)); // Unauthorized
        }
        next(new CustomError("Invalid token", 403)); // Forbidden
      }
    }
  } catch (error) {
    if (error instanceof CustomError) {
      next(error); // Pass the custom error to the error handler
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

export const authorizeUserAction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user_id: tokenUserId } = req.body;
  const { target_user_id: paramUserId } = req.params;

  if (tokenUserId !== paramUserId) {
    throw new CustomError("Forbidden: You can only modify your own data", 403);
  }

  next();
};
