import { createPayrollRepository } from "../../repositories/payroll/createPayroll.repository";
import { CreatePayrollInput } from "../../validations/payroll/createPayroll.validation";
import { PAYROLL } from "../../constants/payroll.constants";

export const createPayrollService = async (data: CreatePayrollInput) => {
  try {
    const payroll_id = await createPayrollRepository(data);
    return {
      success: true,
      message: PAYROLL.MESSAGE.CREATE_SUCCESS,
      payroll_id: payroll_id
    };
  } catch (error: any) {
    throw { status: 500, message: PAYROLL.MESSAGE.CREATE_FAILED };
  }
};