import { Request, Response, NextFunction } from "express";
import { addDepartmentService } from "../../services/department/addDepartment.service";

export const addDepartment = async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = await addDepartmentService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};