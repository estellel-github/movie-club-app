import argon2 from "argon2";
import type { User } from "../models/user.entity.js";
import type { Repository } from "typeorm";
import { generateToken } from "../utils/jwt.js";
import { excludeFields } from "../utils/excludeFields.js";
import type {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
} from "../types/auth.types.js";
import { CustomError } from "../utils/customError.js";
import { UserService } from "./user.service.js";

export class AuthService {
  private userRepo: Repository<User>;
  private userService: UserService;

  constructor(userRepo: Repository<User>) {
    this.userRepo = userRepo;
    this.userService = new UserService();
  }

  async register({
    email,
    password,
    intro_msg,
    username,
  }: RegisterRequest): Promise<RegisterResponse> {
    if (!email || !password || !intro_msg || !username) {
      throw new CustomError("Missing required fields", 400); // Bad Request
    }

    const existingEmail = await this.userRepo.findOneBy({ email });
    if (existingEmail) {
      throw new CustomError("Email already exists", 409); // Conflict
    }

    const existingUsername = await this.userRepo.findOneBy({ username });
    if (existingUsername) {
      throw new CustomError("Username already exists", 409); // Conflict
    }

    // Create the user using UserService
    const newUser = await this.userService.createUser({
      email,
      password,
      intro_msg,
      username,
    });

    const userWithoutPassword = excludeFields(newUser, ["password"]);
    return {
      message: "User registered successfully",
      user: userWithoutPassword,
    };
  }

  async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    if (!email || !password) {
      throw new CustomError("Missing email or password", 400); // Bad Request
    }

    const user = await this.userRepo.findOneBy({ email });
    if (!user || !(await argon2.verify(user.password, password))) {
      throw new CustomError("Invalid email or password", 401); // Unauthorized
    }

    const token = generateToken({ user_id: user.user_id, role: user.role });
    return { token };
  }
}
