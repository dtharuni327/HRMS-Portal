import {Request,Response,NextFunction} from "express";
import {refreshTokenService} from "../../services/authentication/refreshToken.service";
export const refreshToken = async (req: Request,res: Response,
    next: NextFunction) => {
        try {const result =await refreshTokenService(
            req.body.refreshToken);
            return res.status(200).json(result);} catch (error) {
                next(error);}
            };