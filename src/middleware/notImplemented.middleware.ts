import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.js";

export const notImplementedHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(
    new CustomError(
      `The requested method ${req.method} on ${req.originalUrl} is not implemented.`,
      501,
    ),
  );
};
