import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import type { UserRole } from "../models/user.entity.js";
import { User, userRoles } from "../models/user.entity.js";
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
      return excludeFields(user, [
        "email",
        "password",
        "reset_token",
        "reset_token_expires",
      ]);
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
        );
      }

      const user = await this.getUserById(user_id);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      // Restrict updatable fields
      const allowedFields: (keyof User)[] = ["email", "username", "intro_msg"];

      // Detect restricted fields in the incoming data
      const restrictedFields = Object.keys(data).filter(
        (key) => !allowedFields.includes(key as keyof User),
      );

      if (restrictedFields.length > 0) {
        throw new CustomError(
          `Updating the following fields is not allowed: ${restrictedFields.join(", ")}`,
          400,
        );
      }

      // Filter data to include only allowed fields
      const filteredData: Partial<User> = Object.keys(data)
        .filter((key): key is keyof User =>
          allowedFields.includes(key as keyof User),
        )
        .reduce((obj, key) => {
          const value = data[key];
          if (value !== undefined) {
            obj[key] = value;
          }
          return obj;
        }, {} as Partial<User>);

      Object.assign(user, filteredData);

      const updatedUser = await this.userRepo.save(user);
      return excludeFields(updatedUser, [
        "email",
        "password",
        "reset_token",
        "reset_token_expires",
        "status",
      ]);
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

  async verifyResetToken(resetToken: string, email: string): Promise<User> {
    const user = await this.userRepo.findOneBy({
      reset_token: resetToken,
      email,
    });
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
    const isTokenValid = await this.verifyResetToken(token, email);
    if (!isTokenValid) {
      throw new CustomError("Invalid or expired token", 400);
    }

    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;

    // Clear the reset token after successful password reset
    user.reset_token = null;
    user.reset_token_expires = null;

    await this.userRepo.save(user);
  }

  async suspendUser(
    user_role: UserRole,
    target_user_id: string,
  ): Promise<Partial<User>> {
    try {
      if (user_role !== "admin") {
        throw new CustomError("Only admins can suspend users", 403);
      }

      const user = await this.getUserById(target_user_id);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      if (user.status === userStatuses[1]) {
        throw new CustomError("User is already suspended", 400);
      }

      user.status = userStatuses[1];
      const updatedUser = await this.userRepo.save(user);
      return excludeFields(updatedUser, [
        "password",
        "reset_token",
        "reset_token_expires",
      ]);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to suspend user", 500);
    }
  }

  async updateUserRole(
    user_role: string,
    target_user_id: string,
    newRole: UserRole,
  ): Promise<Partial<User>> {
    try {
      if (user_role !== "admin") {
        throw new CustomError("Only admins can update user roles", 403);
      }

      const user = await this.getUserById(target_user_id);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      const validRoles = userRoles;
      if (!validRoles.includes(newRole)) {
        throw new CustomError("Invalid role specified", 400);
      }

      user.role = newRole;
      const updatedUser = await this.userRepo.save(user);
      return excludeFields(updatedUser, [
        "password",
        "reset_token",
        "reset_token_expires",
      ]);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update user role", 500);
    }
  }
}
