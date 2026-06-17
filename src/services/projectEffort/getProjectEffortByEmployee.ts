import { getProjectEffortByEmployee as getProjectEffortByEmployeeRepo } from "../../repositories/projectEffort/getProjectEffortByEmployee";

export const getProjectEffortByEmployee = async (empId: string) => {
  return await getProjectEffortByEmployeeRepo(empId);
};