import { Request, Response } from "express";
import { assignUserRoleService, getUserRolesService, updateUserRoleService } from "../../services/role/userRole.service";
import { USER_ROLE_MESSAGES } from "../../constants/userRole.constants";

export const assignUserRole = async (req: Request, res: Response) => {
  try {
    const { userId, roleId } = req.body;
    const assignment = await assignUserRoleService(userId, roleId);
    return res.status(201).json({ message: USER_ROLE_MESSAGES.ASSIGN_SUCCESS, data: assignment });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserRoles = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const roles = await getUserRolesService(userId);
    return res.status(200).json({ message: USER_ROLE_MESSAGES.FETCH_SUCCESS, data: roles });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;
    const updatedAssignment = await updateUserRoleService(userId, roleId);
    return res.status(200).json({ message: USER_ROLE_MESSAGES.UPDATE_SUCCESS, data: updatedAssignment });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};