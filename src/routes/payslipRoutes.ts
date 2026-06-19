import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createPayslipController } from "../controllers/payslip/createPayslip.controller";
import { getPayslipByEmployeeController } from "../controllers/payslip/getPayslipByEmployee.controller";
import { getPayslipOwnController } from "../controllers/payslip/getPayslipOwn.controller";
import { getAllPayslipsController } from "../controllers/payslip/getAllPayslips.controller";
import { updatePayslipStatusController } from "../controllers/payslip/updatePayslipStatus.controller";
import { deletePayslipController } from "../controllers/payslip/deletePayslip.controller";

const router = express.Router();

// Apply authentication to all payslip routes
router.use(authenticate);

// Super Admin & HR Admin Only
router.post("/", createPayslipController);
router.get("/", getAllPayslipsController);
router.put("/status/:payslip_id", updatePayslipStatusController);
router.delete("/:payslip_id", deletePayslipController);

// HR Admin & Super Admin: View any employee's payslips
router.get("/employee/:Emp_id", getPayslipByEmployeeController);

// All Users: View only their own payslips
router.get("/own", getPayslipOwnController);

export default router;