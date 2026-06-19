import { Request, Response, NextFunction } from "express";
import { deleteDepartmentService } from "../../services/department/deleteDepartment.service";

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteDepartmentService(id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};