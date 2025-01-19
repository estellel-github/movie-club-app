import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { User } from "../models/user.entity.js";
import { excludeFields } from "../utils/excludeFields.js";
import { CustomError } from "../utils/customError.js";

export class UserService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
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
