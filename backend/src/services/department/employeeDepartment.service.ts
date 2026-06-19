import { employeeDepartmentRepository } from "../../repositories/department/employeeDepartment.repository";
import { EMP_DEPT_MESSAGES } from "../../constants/employeeDepartment.constants";

export const mapEmployeeToDepartmentService = async (employeeId: string, departmentId: string) => {
  const checkLink = await employeeDepartmentRepository.findMapping(employeeId, departmentId);
  if (checkLink) throw new Error(EMP_DEPT_MESSAGES.ALREADY_MAPPED);

  return await employeeDepartmentRepository.map(employeeId, departmentId);
};

export const getEmployeeDepartmentService = async (employeeId: string) => {
  const record = await employeeDepartmentRepository.findByEmployeeId(employeeId);
  if (!record) throw new Error(EMP_DEPT_MESSAGES.NOT_FOUND);
  return record;
};

export const getAllEmployeeDepartmentMappingsService = async () => {
  return await employeeDepartmentRepository.getAll();
};

export const updateEmployeeDepartmentService = async (employeeId: string, departmentId: string) => {
  return await employeeDepartmentRepository.updateMapping(employeeId, departmentId);
};

export const deleteEmployeeDepartmentMappingService = async (employeeId: string, departmentId: string, user: any) => {
  const checkLink = await employeeDepartmentRepository.findMapping(employeeId, departmentId);
  if (!checkLink) throw new Error(EMP_DEPT_MESSAGES.NOT_FOUND);

  return await employeeDepartmentRepository.deleteMapping(employeeId, departmentId, user);
};