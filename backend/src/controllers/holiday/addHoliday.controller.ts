import {Request,Response,NextFunction} from "express";
import {addHolidayService} 
from "../../services/holiday/addHoliday.service";
export const addHoliday = async (req: Request,res: Response,
    next: NextFunction) => {
        try {const result =await addHolidayService(req.body);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
}
};