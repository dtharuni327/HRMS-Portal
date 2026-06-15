import {Request,Response,NextFunction} from "express";
import {verifyEmailService} from "../../services/authentication/verifyEmail.service";
export const verifyEmail = async (req: Request,res: Response,
  next: NextFunction) => {
    try {const result =await verifyEmailService(req.body);
        return res.status(200).json(result);
    } catch (error) {next(error);
    }
};