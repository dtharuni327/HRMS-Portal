import { Request, Response, NextFunction } from "express";
import { updateDepartmentService } from "../../services/department/updateDepartment.service";

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await updateDepartmentService(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};