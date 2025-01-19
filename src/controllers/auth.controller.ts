import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { AppDataSource } from "../config/database.js";
import { User } from "../models/user.entity.js";
import { CustomError } from "utils/customError.js";

const authService = new AuthService(AppDataSource.getRepository(User));

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await authService.register(req.body);
    res.status(201).json(response);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to register user", 500),
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await authService.login(req.body);
    res.status(200).json(response);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to log in user", 500),
    );
  }
};
