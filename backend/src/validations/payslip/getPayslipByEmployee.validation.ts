 
export const getPayslipByEmployeeValidation = (
  Emp_id: string | undefined,
  month: string | undefined,
  year: string | undefined
) => {
  if (!Emp_id) {
    return {
      success: false,
      message: "Employee ID is required"
    };
  }

  if (month && isNaN(parseInt(month))) {
    return {
      success: false,
      message: "Month must be a number"
    };
  }

  if (month) {
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      return {
        success: false,
        message: "Month must be between 1 and 12"
      };
    }
  }

  if (year && isNaN(parseInt(year))) {
    return {
      success: false,
      message: "Year must be a number"
    };
  }

  return {
    success: true
  };
};