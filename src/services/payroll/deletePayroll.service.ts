import { deletePayrollRepository } from "../../repositories/payroll/deletePayroll.repository";
import { PAYROLL } from "../../constants/payroll.constants";

export const deletePayrollService = async (Emp_id: string, month: number, year: number) => {
  try {
    await deletePayrollRepository(Emp_id, month, year);
    return {
      success: true,
      message: PAYROLL.MESSAGE.DELETE_SUCCESS
    };
  } catch (error: any) {
    throw { status: 500, message: PAYROLL.MESSAGE.DELETE_FAILED };
  }
};