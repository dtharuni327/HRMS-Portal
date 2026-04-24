import bcrypt from "bcrypt";
import { createUser } from "../models/user.model";
import { UserInput } from "../types/user.types";

export const registerUser = async (user: UserInput) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  return createUser({
    ...user,
    password: hashedPassword,
  });
};