import {
  hashPassword,
  verifyPassword,
  generateToken,
} from "../../middleware/auth.js";
import { AppDataSource } from "../../config/database.js";
import { User } from "../../entities/User.js";

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (email: string, plainPassword: string) => {
  const existingUser = await userRepository.findOneBy({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(plainPassword);
  const newUser = userRepository.create({ email, password: hashedPassword });
  await userRepository.save(newUser);

  const token = generateToken({ id: newUser.user_id, email: newUser.email });
  return { token, user: { id: newUser.user_id, email: newUser.email } };
};

export const loginUser = async (email: string, plainPassword: string) => {
  const user = await userRepository.findOneBy({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await verifyPassword(user.password, plainPassword);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({ id: user.user_id, email: user.email });
  return { token, user: { id: user.user_id, email: user.email } };
};
