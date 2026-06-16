import { hrmsApi } from "../../services/hrmsApi";

export const employeeApi = {
  getEmployees: () => hrmsApi.getEmployees(),
  getEmployee: async (id: string) => {
    const employees = await hrmsApi.getEmployees();
    return employees.find((employee: any) => String(employee.Emp_id ?? employee.id) === id);
  },
  createEmployee: async (_employee: unknown) => {
    throw new Error("Employee creation endpoint is not wired in this frontend module yet.");
  },
  updateEmployee: async ({ id, status }: { id: string; status: string }) =>
    hrmsApi.updateEmployeeStatus(id, status),
  deleteEmployee: async (_id: string) => {
    throw new Error("Employee delete endpoint is not wired in this frontend module yet.");
  },
};

export const useGetEmployeesQuery = undefined;
export const useGetEmployeeQuery = undefined;
export const useCreateEmployeeMutation = undefined;
export const useUpdateEmployeeMutation = undefined;
export const useDeleteEmployeeMutation = undefined;
