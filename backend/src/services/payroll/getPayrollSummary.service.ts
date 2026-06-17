import { getPayrollSummaryRepository } from "../../repositories/payroll/getPayrollSummary.repository";
import { GetPayrollSummaryInput } from "../../validations/payroll/getPayrollSummary.validation";
import { PAYROLL } from "../../constants/payroll.constants";

export const getPayrollSummaryService = async (data: GetPayrollSummaryInput) => {
  try {
    const result = await getPayrollSummaryRepository(data);
    return {
      success: true,
      message: PAYROLL.MESSAGE.FETCH_SUCCESS,
      data: result
    };
  } catch (error: any) {
    throw { status: 500, message: PAYROLL.MESSAGE.FETCH_FAILED };
  }
};