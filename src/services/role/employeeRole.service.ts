import { employeeRoleRepository } from "../../repositories/role/employeeRole.repository";
import { EMP_ROLE_MESSAGES } from "../../constants/employeeRole.constants";

export const mapEmployeeToRoleService = async (employeeId: string, roleId: string) => {
  const checkLink = await employeeRoleRepository.findMapping(employeeId, roleId);
  if (checkLink) throw new Error(EMP_ROLE_MESSAGES.ALREADY_MAPPED);

  return await employeeRoleRepository.map(employeeId, roleId);
};

export const getEmployeeRoleService = async (employeeId: string) => {
  const record = await employeeRoleRepository.findByEmployeeId(employeeId);
  if (!record) throw new Error(EMP_ROLE_MESSAGES.NOT_FOUND);
  return record;
};

export const getAllEmployeeRoleMappingsService = async () => {
  return await employeeRoleRepository.getAll();
};

export const updateEmployeeRoleService = async (employeeId: string, roleId: string) => {
  return await employeeRoleRepository.updateMapping(employeeId, roleId);
};

export const deleteEmployeeRoleMappingService = async (employeeId: string, roleId: string, user: any) => {
  const checkLink = await employeeRoleRepository.findMapping(employeeId, roleId);
  if (!checkLink) throw new Error(EMP_ROLE_MESSAGES.NOT_FOUND);

  return await employeeRoleRepository.deleteMapping(employeeId, roleId, user);
};