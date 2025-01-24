import { ZodError, type ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.js";

export const validate = (bodySchema?: ZodSchema, querySchema?: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (bodySchema) {
        bodySchema.parse({ ...req.body });
      }

      if (querySchema) {
        querySchema.parse({ ...req.query, ...req.params });
      }

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
};
