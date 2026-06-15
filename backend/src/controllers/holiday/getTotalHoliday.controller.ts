import { Request, Response, NextFunction } from "express";
import { getTotalHolidayService } 
from "../../services/holiday/getTotalHoliday.service";
export const getTotalHoliday = async (
  req: Request,res: Response,next: NextFunction
) => {
  try {
    const result = await getTotalHolidayService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};