 
export const createPayslipValidation = (Emp_id: string | undefined, payroll_id: number | undefined) => {
  if (!Emp_id) {
    return {
      success: false,
      message: "Emp_id is required"
    };
  }

  if (!payroll_id) {
    return {
      success: false,
      message: "payroll_id is required"
    };
  }

  if (typeof payroll_id !== "number" || payroll_id <= 0) {
    return {
      success: false,
      message: "payroll_id must be a positive number"
    };
  }

  return {
    success: true
  };
};