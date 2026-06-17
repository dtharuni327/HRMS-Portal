 
export const updatePayslipStatusValidation = (
  payslip_id: string | undefined,
  status: string | undefined,
  payment_date: string | undefined
) => {
  if (!payslip_id) {
    return {
      success: false,
      message: "Payslip ID is required"
    };
  }

  if (!status) {
    return {
      success: false,
      message: "Status is required"
    };
  }

  if (!["PENDING", "GENERATED", "PAID", "SENT"].includes(status)) {
    return {
      success: false,
      message: "Status must be one of: PENDING, GENERATED, PAID, SENT"
    };
  }

  if (payment_date && isNaN(Date.parse(payment_date))) {
    return {
      success: false,
      message: "payment_date must be a valid date"
    };
  }

  return {
    success: true
  };
};