import { getRolesRepository } from "../../repositories/role/getRoles.repository";
import { ROLE_MESSAGES } from "../../constants/role.constants";

export const getRolesService = async (departmentId?: number) => {
  const result = await getRolesRepository(departmentId);
  
  return {
    success: true,
    message: ROLE_MESSAGES.ROLES_FETCHED,
    data: result.recordset
  };
};