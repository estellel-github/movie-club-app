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
    // if (!email || !password || !intro_msg || !username)
    //   throw new Error("Cannot register: Missing information");

    const existingEmail = await this.userRepo.findOneBy({ email });
    if (existingEmail) throw new Error("Email already exists");

    const existingUsername = await this.userRepo.findOneBy({ username });
    if (existingUsername) throw new Error("Username already exists");

    const hashedPassword = await argon2.hash(password);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      intro_msg,
      username,
      status: userStatuses[0],
    });

    const savedUser = await this.userRepo.save(user);

    const userWithoutPassword = excludeFields(savedUser, ["password"]);
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
