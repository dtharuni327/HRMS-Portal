import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  attendanceRouter,
  authRouter,
  departmentRouter,
  employeeRouter,
  holidayRouter,
  leaveRouter,
  roleRouter,
  utilityRouter,
  wfhRouter,
} from "./sql/api";
import announcementRoutes from "./routes/announcement.routes";
import adminDepartmentRoutes from "./routes/department.routes";
import employeeDepartmentRoutes from "./routes/employeeDepartment.routes";
import employeeRoleRoutes from "./routes/employeeRole.routes";
import internalJobRoutes from "./routes/internalJob.routes";
import invoiceRoutes from "./routes/invoice.routes";
import documentsRoutes from "./routes/documents.routes";
import organisationRoutes from "./routes/organisation.routes";
import payrollRoutes from "./routes/payrollRoutes";
import payslipRoutes from "./routes/payslipRoutes";
import profileRoutes from "./routes/profile.routes";
import projectEffortRoutes from "./routes/projectEffortRoutes";
import reimbursementRoutes from "./routes/reimbursement.routes";
import recruitmentRoutes from "./routes/recruitment.routes";
import adminRoleRoutes from "./routes/role.routes";
import salaryRoutes from "./routes/salary.routes";
import systemConfigRoutes from "./routes/systemConfig.routes";
import systemHealthRoutes from "./routes/systemHealth.routes";
import taskRoutes from "./routes/task.routes";
import taxReportsRoutes from "./routes/tax-reports.routes";
import teamDirectoryRoutes from "./routes/teamDirectory.routes";
import userRoleRoutes from "./routes/userRole.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN?.split(",") || [
      "http://localhost:5173",
      "http://127.0.0.1:4173",
      "http://localhost:4173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "HRMS API running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/roles", roleRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/wfh", wfhRouter);
app.use("/api/holidays", holidayRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/announcement", announcementRoutes);
app.use("/api/department", adminDepartmentRoutes);
app.use("/api/employee-department", employeeDepartmentRoutes);
app.use("/api/employee-role", employeeRoleRoutes);
app.use("/api/internal-job", internalJobRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/organisation", organisationRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/payslip", payslipRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/project-effort", projectEffortRoutes);
app.use("/api/reimbursement", reimbursementRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/role", adminRoleRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/system-config", systemConfigRoutes);
app.use("/api/system-health", systemHealthRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/tax-reports", taxReportsRoutes);
app.use("/api/team-directory", teamDirectoryRoutes);
app.use("/api/user-role", userRoleRoutes);
app.use("/", utilityRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(error.statusCode || error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

export default app;
