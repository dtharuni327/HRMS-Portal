<<<<<<< HEAD
<<<<<<< HEAD
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import employeeRoutes from "./routes/employee.routes";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profile.routes";
import recruitmentRoutes from "./routes/recruitment.routes";
import documentsRoutes from "./routes/documents.routes";
import teamDirectoryRoutes from "./routes/teamDirectory.routes";
import organisationRoutes from "./routes/organisation.routes";

=======
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import attendanceRoutes from "./routes/attendanceRoutes";
import wfhRoutes from "./routes/wfhRoutes";
import payrollRoutes from "./routes/payrollRoutes";
import payslipRoutes from "./routes/payslipRoutes";
import projectEffortRoutes from "./routes/projectEffortRoutes"
>>>>>>> origin/feature/attendance-wfh
const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

<<<<<<< HEAD
=======


>>>>>>> origin/feature/attendance-wfh
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

<<<<<<< HEAD
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/team-directory", teamDirectoryRoutes);
app.use("/api/organisation", organisationRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
=======
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import departmentRoutes from "./routes/department.routes";
import roleRoutes from "./routes/role.routes";
import announcementRoutes from "./routes/announcement.routes";
import taskRoutes from "./routes/task.routes";
import systemHealthRoutes from "./routes/systemHealth.routes";
import { metricsMiddleware } from "./middleware/metrics.middleware";
import internalJobRoutes from "./routes/internalJob.routes";
import systemConfigRoutes from "./routes/systemConfig.routes";
import reimbursementRoutes from "./routes/reimbursement.routes";
import invoiceRoutes from "./routes/invoice.routes";
import taxReportsRoutes from "./routes/tax-reports.routes";
import salaryRoutes from "./routes/salary.routes";
import "./config/db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get("/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "HRMS API Running Successfully"
    });
  }
);

app.use("/department", departmentRoutes); 
app.use("/role", roleRoutes);             
app.use("/reimbursement", reimbursementRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/tax-reports", taxReportsRoutes);
app.use("/salary", salaryRoutes);

// Metrics middleware records API request/response metrics
app.use(metricsMiddleware);
app.use("/announcement", announcementRoutes);
app.use("/task", taskRoutes);
app.use("/internal-job", internalJobRoutes);
app.use("/system-config", systemConfigRoutes);

// Centralized Error Handling Middleware
app.use(
  (error: any, req: any, res: any, next: any) => {
    console.error(error);
    res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error"
    });
  }
);

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
>>>>>>> origin/feature/department-roles
});

=======

app.use("/api/attendance", attendanceRoutes);

app.use("/api/wfh", wfhRoutes);  

app.use("/api/payroll", payrollRoutes)

app.use("/api/payslip",payslipRoutes)

app.use("/api/projectEffort",projectEffortRoutes)

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});


app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

>>>>>>> origin/feature/attendance-wfh
export default app;