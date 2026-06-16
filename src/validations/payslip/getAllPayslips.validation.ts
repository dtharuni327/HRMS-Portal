 
export const getAllPayslipsValidation = (
  month: string | undefined,
  year: string | undefined,
  status: string | undefined
) => {
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

  if (status && !["PENDING", "GENERATED", "PAID", "SENT"].includes(status)) {
    return {
      success: false,
      message: "Status must be one of: PENDING, GENERATED, PAID, SENT"
    };
  }

  return {
    success: true
  };
};