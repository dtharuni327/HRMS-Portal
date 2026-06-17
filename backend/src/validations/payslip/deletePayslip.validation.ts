 
export const deletePayslipValidation = (payslip_id: string | undefined) => {
  if (!payslip_id) {
    return {
      success: false,
      message: "Payslip ID is required"
    };
  }

  if (isNaN(parseInt(payslip_id))) {
    return {
      success: false,
      message: "Payslip ID must be a number"
    };
  }

  if (parseInt(payslip_id) <= 0) {
    return {
      success: false,
      message: "Payslip ID must be a positive number"
    };
  }

  return {
    success: true
  };
};