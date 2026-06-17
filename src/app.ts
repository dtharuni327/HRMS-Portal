import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import attendanceRoutes from "./routes/attendanceRoutes";
import wfhRoutes from "./routes/wfhRoutes";
import payrollRoutes from "./routes/payrollRoutes";
import payslipRoutes from "./routes/payslipRoutes";
import projectEffortRoutes from "./routes/projectEffortRoutes"
const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());



app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});


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

export default app;