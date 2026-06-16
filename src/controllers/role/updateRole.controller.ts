import { Request, Response, NextFunction } from "express";
import { updateRoleService } from "../../services/role/updateRole.service";

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await updateRoleService(id, req.body, req.user);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};