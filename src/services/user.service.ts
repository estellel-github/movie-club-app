import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { User } from "../models/user.entity.js";
import { excludeFields } from "../utils/excludeFields.js";
import { CustomError } from "../utils/customError.js";
import argon2 from "argon2";
import { userStatuses } from "../models/user.entity.js";
import { ActivityLogService } from "../services/activity.service.js";
import crypto from "crypto";

export class UserService {
  private userRepo: Repository<User> = AppDataSource.getRepository(User);
  private activityLogService = new ActivityLogService();

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.activityLogService = new ActivityLogService();
  }

  async checkIfUserExists(email: string, username: string) {
    const existingEmail = await this.userRepo.findOneBy({ email });
    if (existingEmail) {
      throw new CustomError("Email already exists", 409);
    }

    const existingUsername = await this.userRepo.findOneBy({ username });
    if (existingUsername) {
      throw new CustomError("Username already exists", 409);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }

  async createUser({
    email,
    password,
    intro_msg,
    username,
  }: {
    email: string;
    password: string;
    intro_msg: string;
    username: string;
  }): Promise<User> {
    try {
      const hashedPassword = await argon2.hash(password);

      const user = this.userRepo.create({
        email,
        password: hashedPassword,
        intro_msg,
        username,
        status: userStatuses[0], // Default status
      });

      const savedUser = await this.userRepo.save(user);

      // Log the "User Joined" activity after successful user creation
      await this.activityLogService.logUserJoin(
        savedUser.user_id,
        savedUser.username,
      );

      return savedUser;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to create user", 500);
    }
  }

  async getUserById(user_id: string): Promise<Partial<User>> {
    try {
      const user = await this.userRepo.findOneBy({ user_id });
      if (!user) {
        throw new CustomError("User not found", 404);
      }
      return excludeFields(user, ["password"]);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve user", 500);
    }
  }

  // (Only the user or admin can update)
  async updateUser(
    user_id: string,
    data: Partial<User>,
    requestingUserId: string,
    role: string,
  ): Promise<Partial<User>> {
    try {
      // Ensure the user is the one trying to update their profile or the requester is an admin
      if (user_id !== requestingUserId && role !== "admin") {
        throw new CustomError(
          "Unauthorized to update this user's profile",
          403,
        ); // Forbidden
      }

      const user = await this.getUserById(user_id);
      if (!user) {
        throw new CustomError("User not found", 404); // Not Found
      }

      Object.assign(user, data);
      const updatedUser = await this.userRepo.save(user);
      return excludeFields(updatedUser, ["password"]);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update user", 500);
    }
  }

  // (Only the user or admin can delete)
  async deleteUser(
    user_id: string,
    requestingUserId: string,
    role: string,
  ): Promise<void> {
    try {
      // Ensure the user is the one trying to delete their account or the requester is an admin
      if (user_id !== requestingUserId && role !== "admin") {
        throw new CustomError(
          "Unauthorized to delete this user's account",
          403,
        ); // Forbidden
      }

      const result = await this.userRepo.delete(user_id);
      if (result.affected === 0) {
        throw new CustomError("User not found", 404); // Not Found
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete user", 500);
    }
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token valid for 24 hours

    user.reset_token = resetToken;
    user.reset_token_expires = expires;

    await this.userRepo.save(user);
    return resetToken;
  }

  async verifyResetToken(resetToken: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ reset_token: resetToken });
    if (
      !user ||
      !user.reset_token_expires ||
      user.reset_token_expires < new Date()
    ) {
      throw new CustomError("Invalid or expired reset token", 400);
    }
    return user;
  }

  async updatePassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<void> {
    const isTokenValid = this.verifyResetToken(token);
    if (!isTokenValid) {
      throw new CustomError("Invalid or expired token", 400);
    }

    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;

    await this.userRepo.save(user);
  }
}
