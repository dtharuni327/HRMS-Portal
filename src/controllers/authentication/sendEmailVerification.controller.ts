import {Request,Response,NextFunction} from "express";
import {sendEmailVerificationService} 
from "../../services/authentication/sendEmailVerification.service";
export const sendEmailVerification = async (req: Request,res: Response,
  next: NextFunction) => {
    try {const result =await sendEmailVerificationService(req.body);
        return res.status(200).json(result);
    } catch (error) {next(error);
    }
};