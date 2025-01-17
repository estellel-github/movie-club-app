import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { AppDataSource } from "../config/database.js";
import { User } from "../models/user.entity.js";
import type { RegisterRequest, LoginRequest } from "../types/auth.types.js";

const authService = new AuthService(AppDataSource.getRepository(User));

export const register = async (req: Request, res: Response) => {
  try {
    const requestData: RegisterRequest = req.body;
    const response = await authService.register(requestData);
    res.status(201).json(response);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const requestData: LoginRequest = req.body;
    const response = await authService.login(requestData);
    res.status(200).json(response);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
