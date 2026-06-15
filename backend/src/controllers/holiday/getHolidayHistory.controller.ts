import {Request,Response,NextFunction} from "express";
import { getHolidayHistoryService } 
from "../../services/holiday/getHolidayHistory.service";
export const getHolidayHistory = async (
  req: Request,res: Response,next: NextFunction) => {
  try {
    const result =await getHolidayHistoryService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};