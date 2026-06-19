import {Request,Response,NextFunction} from "express";
import {updateNotificationVisibilityService} 
from "../../services/leave/updateNotificationVisibility.service";
export const updateNotificationVisibility = async (
  req: any,res: Response,next: NextFunction) => {
  try {
    const result =await updateNotificationVisibilityService(
        req.params,req.user);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};