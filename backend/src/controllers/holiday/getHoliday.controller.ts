import {Request,Response,NextFunction} from "express";
import {getHolidayService} from "../../services/holiday/getHoliday.service";
export const getHoliday = async (req: Request,res: Response,next: NextFunction) => {
  try {const result =await getHolidayService();
    return res.status(200).json(result);
} catch (error) {
    next(error);
}
};