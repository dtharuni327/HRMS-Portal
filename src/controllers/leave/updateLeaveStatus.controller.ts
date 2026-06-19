import {Request,Response,NextFunction} from "express";
import {updateLeaveStatusService} from "../../services/leave/updateLeaveStatus.service";
export const updateLeaveStatus = async (req: any,res: Response,
  next: NextFunction) => {
    try {
        const result =await updateLeaveStatusService(
        req.body,req.user);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};