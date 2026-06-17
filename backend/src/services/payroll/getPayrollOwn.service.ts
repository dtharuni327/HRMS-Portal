import { getPayrollOwnRepository } from "../../repositories/payroll/getPayrollOwn.repository";
import { GetPayrollOwnInput } from "../../validations/payroll/getPayrollOwn.validation";
import { PAYROLL } from "../../constants/payroll.constants";

export const getPayrollOwnService = async (Emp_id: string, data: GetPayrollOwnInput) => {
  try {
    const result = await getPayrollOwnRepository(Emp_id, data);
    return {
      success: true,
      message: PAYROLL.MESSAGE.FETCH_SUCCESS,
      data: result
    };
  } catch (error: any) {
    throw { status: 500, message: PAYROLL.MESSAGE.FETCH_FAILED };
  }
};