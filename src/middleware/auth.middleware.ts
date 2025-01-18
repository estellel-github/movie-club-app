import type { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import type { AuthenticatedRequest } from "types/express.js";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    if (!decoded || !decoded.user_id) {
      throw new Error("Invalid token");
    }
    req.user = decoded as { user_id: string; role: string }; // Attach user info to the request
    console.log("Authenticated user:", req.user);
    next(); // Pass control to the next middleware or route handler
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(401).json({ error: "Unknown error" });
    }
  }
};
