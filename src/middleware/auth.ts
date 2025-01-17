import jwt from "jsonwebtoken";
import argon2 from "argon2";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables.");
}

export const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password);
};

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string,
): Promise<boolean> => {
  return await argon2.verify(hashedPassword, plainPassword);
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
