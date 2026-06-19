import { getPayrollByEmployeeRepository } from "../../repositories/payroll/getPayrollByEmployee.repository";
import { GetPayrollByEmployeeInput } from "../../validations/payroll/getPayrollByEmployee.validation";
import { PAYROLL } from "../../constants/payroll.constants";

export const getPayrollByEmployeeService = async (employee_id: string, data: GetPayrollByEmployeeInput) => {
  try {
    const result = await getPayrollByEmployeeRepository(employee_id, data);
    return {
      success: true,
      message: PAYROLL.MESSAGE.FETCH_SUCCESS,
      data: result
    };
  } catch (error: any) {
    throw { status: 500, message: PAYROLL.MESSAGE.FETCH_FAILED };
  }
};