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
import { userStatuses } from "../models/user.entity.js";
import { CustomError } from "utils/customError.js";

export class AuthService {
  private userRepo: Repository<User>;

  constructor(userRepo: Repository<User>) {
    this.userRepo = userRepo;
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

    const hashedPassword = await argon2.hash(password);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      intro_msg,
      username,
      status: userStatuses[0], // Default status
    });

    const savedUser = await this.userRepo.save(user);

    const userWithoutPassword = excludeFields(savedUser, ["password"]);
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
