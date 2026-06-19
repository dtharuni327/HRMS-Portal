import{Request,Response,NextFunction} from "express";
import{registerService} from "../../services/authentication/register.service";
export const register = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const result = await registerService(req.body);
        return res.status(201).json(result);
    }catch (error){
        next(error);
    }
}