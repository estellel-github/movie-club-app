import { ZodError, type ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.js";

export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const formattedErrors = err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }));

        return res.status(400).json({
          errors: formattedErrors,
        });
      }

      next(new CustomError("Validation Error", 400));
    }
  };

export const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const formattedErrors = err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }));

        return res.status(400).json({
          errors: formattedErrors,
        });
      }

      next(new CustomError("Validation Error", 400));
    }
  };
