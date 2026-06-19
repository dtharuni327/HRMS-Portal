import express from "express";
import { getPayrollListController } from "../controllers/payroll/getPayrollList.controller";
import { getPayrollByEmployeeController } from "../controllers/payroll/getPayrollByEmployee.controller";
import { createPayrollController } from "../controllers/payroll/createPayroll.controller";
import { updatePayrollController } from "../controllers/payroll/updatePayroll.controller";
import { deletePayrollController } from "../controllers/payroll/deletePayroll.controller";
import { getPayrollSummaryController } from "../controllers/payroll/getPayrollSummary.controller";
import { approvePayrollController } from "../controllers/payroll/approvePayroll.controller";
import { authenticate } from "../middleware/auth.middleware";
import { getPayrollOwnController } from "../controllers/payroll/getPayrollOwn.controller";

const router = express.Router();

router.use(authenticate);

router.get("/", getPayrollListController);
router.get("/employee/:employee_id", getPayrollByEmployeeController);
router.get("/summary", getPayrollSummaryController);
router.post("/", createPayrollController);
router.put("/update/:Emp_id/:month/:year", updatePayrollController);
router.delete("/delete/:Emp_id/:month/:year", deletePayrollController);
router.put("/approve/:Emp_id/:month/:year", approvePayrollController);
router.get("/own", getPayrollOwnController);

export default router;