import { db } from "../services/config/db";
import { UserInput } from "../types/user.types";

export const createUser = async (user: UserInput) => {
  const { name, email, password } = user;
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return result;
};

export const findUserByEmail = async (email: string): Promise<boolean> => {
  const [rows] = await db.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  return (rows as any[]).length > 0;
};