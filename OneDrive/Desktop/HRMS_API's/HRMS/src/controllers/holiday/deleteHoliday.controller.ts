import { Request, Response, NextFunction } from "express";
import { deleteHolidayService } 
from "../../services/holiday/deleteHoliday.service";
export const deleteHoliday = async (
  req: Request,res: Response,next: NextFunction) => {
  try {
    const client_id = Number(req.params.client_id);
    const result = await deleteHolidayService(client_id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};