import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { User } from "../models/user.entity.js";
import { excludeFields } from "../utils/excludeFields.js";
import { CustomError } from "../utils/customError.js";
import argon2 from "argon2";
import { userStatuses } from "../models/user.entity.js";
import { ActivityLogService } from "./activityLog.service.js"; // Import ActivityLogService

export class UserService {
  private userRepo: Repository<User>;
  private activityLogService: ActivityLogService; // Instance of ActivityLogService

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.activityLogService = new ActivityLogService(); // Initialize ActivityLogService
  }

  // Create a new user
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

  async updateUser(
    user_id: string,
    data: Partial<User>,
  ): Promise<Partial<User>> {
    try {
      const user = await this.getUserById(user_id);
      if (!user) {
        throw new CustomError("User not found", 404);
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

  async deleteUser(user_id: string): Promise<void> {
    try {
      const result = await this.userRepo.delete(user_id);
      if (result.affected === 0) {
        throw new CustomError("User not found", 404);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete user", 500);
    }
  }
}
