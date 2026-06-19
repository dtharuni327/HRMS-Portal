import { deleteRoleRepository } from "../../repositories/role/deleteRole.repository";
import { ROLE_MESSAGES } from "../../constants/role.constants";

export const deleteRoleService = async (roleId: number, user: any) => {
  const result = await deleteRoleRepository(roleId, user);

  if (result.recordset[0]?.Status !== "SUCCESS") {
    throw new Error(result.recordset[0]?.Message || "Failed to delete role");
  }

  return {
    success: true,
    message: ROLE_MESSAGES.ROLE_DELETED
  };
};