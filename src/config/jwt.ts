import jwt from "jsonwebtoken";
import { env } from "./env";

export const generateAccessToken = (
  payload: object
): string => {
  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN
    } as jwt.SignOptions
  );
};

export const verifyAccessToken = (
  token: string
) => {
  return jwt.verify(
    token,
    env.JWT_SECRET
  );
};