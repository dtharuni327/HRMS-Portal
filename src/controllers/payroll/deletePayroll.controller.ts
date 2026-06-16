import { Request, Response } from "express";
import { deletePayrollService } from "../../services/payroll/deletePayroll.service";

export const deletePayrollController = async (req: Request, res: Response) => {
  try {
    const { Emp_id, month, year } = req.params;

    if (!Emp_id || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Emp_id, month, and year are required"
      });
    }

    await deletePayrollService(
      Emp_id,
      parseInt(month),
      parseInt(year)
    );

    res.status(200).json({
      success: true,
      message: "Payroll deleted successfully"
    });
  } catch (error) {
    console.error("Delete Payroll Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete payroll"
    });
  }
};