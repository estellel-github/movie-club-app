import type { User } from "../models/user.entity.js";

// Request types
export interface RegisterRequest {
  email: string;
  password: string;
  intro_msg: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Response types
export interface RegisterResponse {
  message: string;
  user: Omit<User, "password">; // Exclude the password field
}

export interface LoginResponse {
  token: string;
}
