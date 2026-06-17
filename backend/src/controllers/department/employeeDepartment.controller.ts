import { Request, Response } from "express";
import { mapEmployeeToDepartmentService, getEmployeeDepartmentService, getAllEmployeeDepartmentMappingsService, updateEmployeeDepartmentService, deleteEmployeeDepartmentMappingService } from "../../services/department/employeeDepartment.service";
import { EMP_DEPT_MESSAGES } from "../../constants/employeeDepartment.constants";

export const mapEmployeeDepartment = async (req: Request, res: Response) => {
  try {
    const { employeeId, departmentId } = req.body;
    const mapping = await mapEmployeeToDepartmentService(employeeId, departmentId);
    return res.status(201).json({ message: EMP_DEPT_MESSAGES.MAP_SUCCESS, data: mapping });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getEmployeeDepartment = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const mapping = await getEmployeeDepartmentService(employeeId);
    return res.status(200).json({ message: EMP_DEPT_MESSAGES.FETCH_SUCCESS, data: mapping });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const getAllEmployeeDepartments = async (req: Request, res: Response) => {
  try {
    const mappings = await getAllEmployeeDepartmentMappingsService();
    return res.status(200).json({ message: EMP_DEPT_MESSAGES.FETCH_SUCCESS, data: mappings });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateEmployeeDepartment = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const { departmentId } = req.body;
    const updatedMapping = await updateEmployeeDepartmentService(employeeId, departmentId);
    return res.status(200).json({ message: EMP_DEPT_MESSAGES.UPDATE_SUCCESS, data: updatedMapping });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteEmployeeDepartment = async (req: any, res: Response) => {
  try {
    const { employeeId, departmentId } = req.params;
    const result = await deleteEmployeeDepartmentMappingService(employeeId, departmentId, req.user);
    return res.status(200).json({ message: EMP_DEPT_MESSAGES.DELETE_SUCCESS, data: result });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};