import { getEmployeeByIdRepo } from "../../repositories/employee/employee.repository";

interface GetByIdOptions {
  empId: string;
  loggedInEmpId: string;
  role?: string;
}

export const getEmployeeByIdService = async (options: GetByIdOptions) => {
  const { empId, loggedInEmpId, role } = options;
  const result = await getEmployeeByIdRepo(empId, loggedInEmpId, role);
  return result.recordset[0] ?? null; // null signals not-found or access denied to the controller
};