import {Request,Response,NextFunction} from "express";
import {getLeaveNotificationsService} 
from "../../services/leave/getLeaveNotifications.service";
export const getLeaveNotifications = async (
  req: any,res: Response,next: NextFunction) => {
  try {
    const result =await getLeaveNotificationsService(
        req.user);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};