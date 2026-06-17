import { Request, Response, NextFunction } from "express";
import { deleteRoleService } from "../../services/role/deleteRole.service";

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteRoleService(id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};