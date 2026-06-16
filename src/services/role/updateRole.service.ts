import { updateRoleRepository } from "../../repositories/role/updateRole.repository";
import { ROLE_MESSAGES } from "../../constants/role.constants";

export const updateRoleService = async (id: number, data: any, user: any) => {
  const { role_name, permissions, status } = data;

  const result = await updateRoleRepository(id, { role_name, permissions, status }, user);

  if (result.recordset[0]?.Status !== "SUCCESS") {
    throw new Error(result.recordset[0]?.Message || "Failed to update role");
  }

  return {
    success: true,
    message: ROLE_MESSAGES.ROLE_UPDATED
  };
};