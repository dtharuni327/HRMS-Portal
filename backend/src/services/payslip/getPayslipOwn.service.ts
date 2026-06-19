import { getPayslipByEmployeeService } from "./getPayslipByEmployee.service";

export const getPayslipOwnService = async (
  Emp_id: string,
  month: number | null,
  year: number | null
) => {
  return await getPayslipByEmployeeService(Emp_id, month, year);
};