import { Request, Response, NextFunction } from "express";
import { getDepartmentsService } from "../../services/department/getDepartments.service";

export const getDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getDepartmentsService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};