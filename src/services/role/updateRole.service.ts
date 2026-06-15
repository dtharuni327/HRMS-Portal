import { updateRoleRepository } from "../../repositories/role/updateRole.repository";
import { ROLE_MESSAGES } from "../../constants/role.constants";

export const updateRoleService = async (data: any, user: any) => {
  const { role_id, role_name, permissions, status } = data;
  
  // Separates the role_id, target data details object, and updating user context 
  const result = await updateRoleRepository(role_id, { role_name, permissions, status }, user);
  
  if (result.recordset[0]?.Status !== "SUCCESS") {
    throw new Error(result.recordset[0]?.Message || "Failed to update role");
  }
  
  return {
    success: true,
    message: ROLE_MESSAGES.ROLE_UPDATED
  };
};