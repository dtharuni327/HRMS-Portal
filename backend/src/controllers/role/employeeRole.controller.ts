import { Request, Response } from "express";
import { mapEmployeeToRoleService, getEmployeeRoleService, getAllEmployeeRoleMappingsService, updateEmployeeRoleService, deleteEmployeeRoleMappingService } from "../../services/role/employeeRole.service";
import { EMP_ROLE_MESSAGES } from "../../constants/employeeRole.constants";

export const mapEmployeeRole = async (req: Request, res: Response) => {
  try {
    const { employeeId, roleId } = req.body;
    const mapping = await mapEmployeeToRoleService(employeeId, roleId);
    return res.status(201).json({ message: EMP_ROLE_MESSAGES.MAP_SUCCESS, data: mapping });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getEmployeeRole = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const mapping = await getEmployeeRoleService(employeeId);
    return res.status(200).json({ message: EMP_ROLE_MESSAGES.FETCH_SUCCESS, data: mapping });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const getAllEmployeeRoles = async (req: Request, res: Response) => {
  try {
    const mappings = await getAllEmployeeRoleMappingsService();
    return res.status(200).json({ message: EMP_ROLE_MESSAGES.FETCH_SUCCESS, data: mappings });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateEmployeeRole = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const { roleId } = req.body;
    const updatedMapping = await updateEmployeeRoleService(employeeId, roleId);
    return res.status(200).json({ message: EMP_ROLE_MESSAGES.UPDATE_SUCCESS, data: updatedMapping });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteEmployeeRole = async (req: any, res: Response) => {
  try {
    const { employeeId, roleId } = req.params;
    const result = await deleteEmployeeRoleMappingService(employeeId, roleId, req.user);
    return res.status(200).json({ message: EMP_ROLE_MESSAGES.DELETE_SUCCESS, data: result });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};