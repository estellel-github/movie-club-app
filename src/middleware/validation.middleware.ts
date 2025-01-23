import type { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.js";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Before Validation:", req.body); // Debug
      schema.parse(req.body);
      console.log("Validation Passed");
      next();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Validation Error:", err); // Debug
        next(new CustomError(err.message, 400));
      } else {
        console.error("Validation Error:", err); // Debug
        next(new CustomError("Validation Error", 400));
      }
    }
  };
