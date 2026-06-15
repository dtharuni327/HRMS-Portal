import { Request, Response, NextFunction } from "express";
import { forgotPasswordService } from "../../services/authentication/forgotPassword.service";
export const forgotPassword = async (req: Request,res: Response,next: NextFunction) => {
  try {const result =await forgotPasswordService(req.body);
    return res.status(200).json(result);} catch (error) {next(error);
    }
};