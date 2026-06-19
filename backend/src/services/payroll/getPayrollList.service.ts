import { getPayrollListRepository } from "../../repositories/payroll/getPayrollList.repository";
import { GetPayrollListInput } from "../../validations/payroll/getPayrollList.validation";
import { PAYROLL } from "../../constants/payroll.constants";


export const getPayrollListService = async (data: GetPayrollListInput) => {
  try {
    console.log("Fetching payroll with:", data);  
    const result = await getPayrollListRepository(data);
    console.log("Payroll result:", result); 
    return {
      success: true,
      message: PAYROLL.MESSAGE.FETCH_SUCCESS,
      data: result
    };
  } catch (error: any) {
    console.error("Payroll fetch error:", error);  
    throw { status: 500, message: "Failed to fetch payroll" };
  }
};