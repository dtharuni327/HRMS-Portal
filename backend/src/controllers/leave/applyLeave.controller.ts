import {Request,Response,NextFunction} from "express";
import {applyLeaveService} from "../../services/leave/applyLeave.service";
export const applyLeave = async (req: any,res: Response,
  next: NextFunction) => {
    try {const result =await applyLeaveService(req.body,req.user);
        return res.status(201).json(result);
    } catch (error) {next(error);
    }
};