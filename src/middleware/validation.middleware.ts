import type { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import { CustomError } from "@/utils/customError.js";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: unknown) {
      if (err instanceof Error) {
        next(new CustomError(err.message, 400));
      } else {
        next(new CustomError("Validation Error", 400));
      }
    }
  };
