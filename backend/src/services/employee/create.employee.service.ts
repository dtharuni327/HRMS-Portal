import { createEmployeeRepo } from "../../repositories/employee/employee.repository";
import { CreateEmployeeInput } from "../../validations/employee/create.employee.validation";

export const createEmployeeService = async (data: CreateEmployeeInput) => {
  const result = await createEmployeeRepo(data); // recordset[0] holds the created row; throws on constraint violations
  return result.recordset[0];
};