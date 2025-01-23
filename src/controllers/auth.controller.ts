import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { CustomError } from "../utils/customError.js";

const authService = new AuthService();

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

export const generateResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new CustomError("Email is required", 400);
    }
    await authService.generateResetToken(email);
    res.status(200).json({
      message: "Reset token generated. Contact admin to retrieve it.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reset_token, new_password } = req.body;
    await authService.resetPassword(reset_token, new_password);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
