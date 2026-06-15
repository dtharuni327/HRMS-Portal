import { createRoleRepository } from "../../repositories/role/addRole.repository";
import { ROLE_MESSAGES } from "../../constants/role.constants";

export const addRoleService = async (data: any, user: any) => {
  const { role_name, permissions } = data;
  
  await createRoleRepository({ role_name, permissions }, user);
  
  return {
    success: true,
    message: ROLE_MESSAGES.ROLE_CREATED
  };
};