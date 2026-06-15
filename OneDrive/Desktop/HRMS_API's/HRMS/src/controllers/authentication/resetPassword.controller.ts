import {Request,Response,NextFunction} from "express";
import {resetPasswordService} from "../../services/authentication/resetPassword.service";
export const resetPassword = async (req: Request,res: Response,
    next: NextFunction) => {
        try {const result =await resetPasswordService(req.body);
            return res.status(200).json(result);} catch (error) {
                next(error);}
};