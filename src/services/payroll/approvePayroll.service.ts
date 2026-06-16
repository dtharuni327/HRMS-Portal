import { approvePayrollRepository } from "../../repositories/payroll/approvePayroll.repository";
import { PAYROLL } from "../../constants/payroll.constants";

export const approvePayrollService = async (Emp_id: string, month: number, year: number, approved_by: string) => {
  try {
    await approvePayrollRepository(Emp_id, month, year, approved_by);
    return {
      success: true,
      message: PAYROLL.MESSAGE.APPROVE_SUCCESS
    };
  } catch (error: any) {
    throw { status: 500, message: PAYROLL.MESSAGE.APPROVE_FAILED };
  }
};