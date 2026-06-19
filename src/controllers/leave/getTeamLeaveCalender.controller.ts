import {Request,Response,NextFunction} from "express";
import {getTeamLeaveCalendarService} 
from "../../services/leave/getTeamLeaveCalender.service";
export const getTeamLeaveCalendar =
async (
 req: Request,
 res: Response,
 next: NextFunction
) => {
 try {
   const result =
   await getTeamLeaveCalendarService(
      req.query
   );
   return res
     .status(200)
     .json(result);
 } catch (error) {
   next(error);
 }
};