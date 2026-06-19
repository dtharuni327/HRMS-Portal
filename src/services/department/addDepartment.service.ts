import { createDepartmentRepository } from "../../repositories/department/addDepartment.repository";
import { DEPARTMENT_MESSAGES } from "../../constants/department.constants";

export const addDepartmentService = async (data: any, user: any) => {
  const { department_name, description } = data;
  
  // Call the function using its verified exported name
  await createDepartmentRepository({ department_name, description }, user);
  
  return {
    success: true,
    message: DEPARTMENT_MESSAGES.DEPARTMENT_CREATED
  };
};