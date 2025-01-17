import argon2 from "argon2";
import type { User } from "../models/user.entity.js";
import type { Repository } from "typeorm";
import { generateToken } from "../utils/jwt.js";
import type {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
} from "../types/auth.types.js";

export class AuthService {
  private userRepo: Repository<User>;

  constructor(userRepo: Repository<User>) {
    this.userRepo = userRepo;
  }

  async register({
    email,
    password,
    intro_msg,
  }: RegisterRequest): Promise<RegisterResponse> {
    const existingUser = await this.userRepo.findOneBy({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await argon2.hash(password);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      intro_msg,
    });
    const savedUser = await this.userRepo.save(user);

    const { password: _, ...userWithoutPassword } = savedUser;
    return {
      message: "User registered successfully",
      user: userWithoutPassword,
    };
  }

  async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user || !(await argon2.verify(user.password, password))) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken({ user_id: user.user_id, role: user.role });
    return { token };
  }
}
