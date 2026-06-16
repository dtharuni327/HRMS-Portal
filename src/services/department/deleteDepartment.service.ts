import { deleteDepartmentRepository } from "../../repositories/department/deleteDepartment.repository";
import { DEPARTMENT_MESSAGES } from "../../constants/department.constants";

export const deleteDepartmentService = async (departmentId: number, user: any) => {
  const result = await deleteDepartmentRepository(departmentId, user);

  if (result.recordset[0]?.Status !== "SUCCESS") {
    throw new Error(result.recordset[0]?.Message || "Failed to delete department");
  }

  return {
    success: true,
    message: DEPARTMENT_MESSAGES.DEPARTMENT_DELETED
  };
};