import { Request, Response, NextFunction } from "express";
import { getRemainingHolidayService } 
from "../../services/holiday/getRemainingHoliday.service";
export const getRemainingHoliday = async (req: Request,
  res: Response,next: NextFunction) => {
  try {
    const result = await getRemainingHolidayService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};