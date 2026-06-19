import { userRoleRepository } from "../../repositories/role/userRole.repository";
import { USER_ROLE_MESSAGES } from "../../constants/userRole.constants";

export const assignUserRoleService = async (userId: string, roleId: string) => {
  const existingAssignment = await userRoleRepository.findAssignment(userId, roleId);
  if (existingAssignment) throw new Error(USER_ROLE_MESSAGES.ALREADY_ASSIGNED);

  return await userRoleRepository.assign(userId, roleId);
};

export const getUserRolesService = async (userId: string) => {
  return await userRoleRepository.findByUserId(userId);
};

export const updateUserRoleService = async (userId: string, roleId: string) => {
  return await userRoleRepository.updateUserRole(userId, roleId);
};