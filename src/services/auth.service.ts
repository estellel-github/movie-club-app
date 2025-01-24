import argon2 from "argon2";
import { generateToken } from "../utils/jwt.js";
import { excludeFields } from "../utils/excludeFields.js";
import type {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
} from "../types/auth.types.js";
import { CustomError } from "../utils/customError.js";
import { UserService } from "../services/user.service.js";

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register({
    email,
    password,
    intro_msg,
    username,
  }: RegisterRequest): Promise<RegisterResponse> {
    try {
      await this.userService.checkIfUserExists(email, username);

      const newUser = await this.userService.createUser({
        email,
        password,
        intro_msg,
        username,
      });

      const userWithoutSensitiveInfo = excludeFields(newUser, [
        "password",
        "reset_token",
        "reset_token_expires",
      ]);

      return {
        message: "User registered successfully",
        user: userWithoutSensitiveInfo,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to register", 500);
    }
  }

  async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findUserByEmail(email);
    if (!user || !(await argon2.verify(user.password, password))) {
      throw new CustomError("Invalid email or password", 401);
    }

    const token = generateToken({ user_id: user.user_id, role: user.role });
    return { token };
  }

  async generateResetToken(email: string): Promise<string> {
    return this.userService.generateResetToken(email);
  }

  async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string,
  ): Promise<void> {
    return this.userService.resetPassword(email, resetToken, newPassword);
  }
}
