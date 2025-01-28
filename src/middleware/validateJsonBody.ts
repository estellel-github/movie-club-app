import { CustomError } from "../utils/customError.js";
import type { Request, Response, NextFunction } from "express";

export const validateJsonBody = (
  err: SyntaxError & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    next(new CustomError("Malformed JSON in request body", 400));
  } else {
    next(err);
  }
};
