import jwt from "jsonwebtoken";
import { env } from "./env";
<<<<<<< HEAD
export const generateAccessToken = (
  payload: any 
) => {
    return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );
};
export const generateRefreshToken = (
  payload: any
) => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d"
    }
  );
};
=======

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

>>>>>>> origin/leave_management-API-kiruthika
export const verifyAccessToken = (
  token: string
) => {
  return jwt.verify(
    token,
    env.JWT_SECRET
  );
<<<<<<< HEAD
};
export const verifyRefreshToken = (
  token: string
) => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  );
=======
>>>>>>> origin/leave_management-API-kiruthika
};