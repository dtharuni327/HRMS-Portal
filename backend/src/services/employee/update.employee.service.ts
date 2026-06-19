import { updateEmployeeRepo } from "../../repositories/employee/employee.repository";
import { UpdateEmployeeInput } from "../../validations/employee/update.employee.validation";

interface UpdateOptions extends UpdateEmployeeInput {
  empId: string;
  loggedInEmpId: string;
  loggedInRole: string;
}

export const updateEmployeeService = async (options: UpdateOptions) => {
  const result = await updateEmployeeRepo(options);
  return result.recordset[0]; // SP returns the updated row; throws on constraint or access errors
};