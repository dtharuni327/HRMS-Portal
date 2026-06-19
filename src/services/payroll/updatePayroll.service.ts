import { updatePayrollRepository } from "../../repositories/payroll/updatePayroll.repository";
import { UpdatePayrollInput } from "../../validations/payroll/updatePayroll.validation";
import { PAYROLL } from "../../constants/payroll.constants";

export const updatePayrollService = async (Emp_id: string, month: number, year: number, data: UpdatePayrollInput) => {
  try {
    await updatePayrollRepository(Emp_id, month, year, data);
    return {
      success: true,
      message: PAYROLL.MESSAGE.UPDATE_SUCCESS
    };
  } catch (error: any) {
    throw { status: 500, message: PAYROLL.MESSAGE.UPDATE_FAILED };
  }
};