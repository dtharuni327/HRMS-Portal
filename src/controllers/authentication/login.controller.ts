import { Request, Response, NextFunction } from "express";
import { loginService } from "../../services/authentication/login.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};