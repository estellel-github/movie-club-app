import type { Request, Response } from "express";
import { CustomError } from "@/utils/customError.js";

export const errorHandler = (err: unknown, req: Request, res: Response) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};
