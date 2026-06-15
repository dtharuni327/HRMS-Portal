import { Request, Response, NextFunction } from "express";
import { getRolesService } from "../../services/role/getRoles.service";

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
    const result = await getRolesService(departmentId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};