import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { User } from "../models/user.entity.js";

export class UserService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async getUserById(user_id: string): Promise<User | null> {
    return this.userRepo.findOneBy({ user_id });
  }

  async updateUser(user_id: string, data: Partial<User>): Promise<User> {
    const user = await this.getUserById(user_id);
    if (!user) throw new Error("User not found");

    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  async deleteUser(user_id: string): Promise<void> {
    const result = await this.userRepo.delete(user_id);
    if (result.affected === 0) throw new Error("User not found");
  }
}
