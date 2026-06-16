import { Request, Response, NextFunction } from "express";
import { getUsedHolidayService } 
from "../../services/holiday/getUsedHoliday.service";
export const getUsedHoliday = async (req: Request,res: Response,
  next: NextFunction
) => {
  try {
    const result = await getUsedHolidayService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};