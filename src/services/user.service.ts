import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { User } from "../models/user.entity.js";
import { excludeFields } from "../utils/excludeFields.js";

export class UserService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async getUserById(user_id: string): Promise<Partial<User>> {
    const user = await this.userRepo.findOneBy({ user_id });
    if (!user) throw new Error("User not found");

    return excludeFields(user, ["password"]);
  }

  async updateUser(
    user_id: string,
    data: Partial<User>,
  ): Promise<Partial<User>> {
    const user = await this.getUserById(user_id);
    if (!user) throw new Error("User not found");

    Object.assign(user, data);
    const updatedUser = await this.userRepo.save(user);
    return excludeFields(updatedUser, ["password"]);
  }

  async deleteUser(user_id: string): Promise<void> {
    const result = await this.userRepo.delete(user_id);
    if (result.affected === 0) throw new Error("User not found");
  }
}
