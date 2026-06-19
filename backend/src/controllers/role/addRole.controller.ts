import { Response, NextFunction } from "express";
import { addRoleService } from "../../services/role/addRole.service";

export const addRole = async (req: any, res: Response, next: NextFunction) => {
  try {
   
    const result = await addRoleService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};