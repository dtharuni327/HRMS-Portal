import { updateDepartmentRepository } from "../../repositories/department/updateDepartment.repository";
import { DEPARTMENT_MESSAGES } from "../../constants/department.constants";

export const updateDepartmentService = async (id: number, data: any, user: any) => {
  const { department_name, description, status } = data;

  const result = await updateDepartmentRepository(id, { department_name, description, status }, user);

  if (result.recordset[0]?.Status !== "SUCCESS") {
    throw new Error(result.recordset[0]?.Message || "Failed to update department");
  }

  return {
    success: true,
    message: DEPARTMENT_MESSAGES.DEPARTMENT_UPDATED
  };
};