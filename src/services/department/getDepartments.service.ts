import { getDepartmentsRepository } from "../../repositories/department/getDepartments.repository";
import { DEPARTMENT_MESSAGES } from "../../constants/department.constants";

export const getDepartmentsService = async () => {
  const result = await getDepartmentsRepository();
  
  return {
    success: true,
    message: DEPARTMENT_MESSAGES.DEPARTMENTS_FETCHED,
    data: result.recordset
  };
};