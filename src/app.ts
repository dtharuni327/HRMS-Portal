import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

/* ================================
   ROUTE IMPORTS
================================ */

//import authRoutes from "./routes/authRoutes";
//import employeeRoutes from "./routes/employeeRoutes";

import attendanceRoutes from "./routes/attendanceRoutes";
import wfhRoutes from "./routes/wfhRoutes";

//import departmentRoutes from "./routes/departmentRoutes";
//import leaveRoutes from "./routes/leaveRoutes";
//import holidayRoutes from "./routes/holidaysRoutes";
//import roleRoutes from "./routes/rolesRoutes";

const app = express();

/* ================================
   MIDDLEWARE
================================ */

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

/* ================================
   HEALTH CHECK
================================ */

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

/* ================================
   ROUTES
================================ */

//app.use("/api/auth", authRoutes);

//app.use("/api/employees", employeeRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/wfh", wfhRoutes);  

//app.use("/api/departments", departmentRoutes);

//app.use("/api/roles", roleRoutes);

//app.use("/api/leave", leaveRoutes);

//app.use("/api/holidays", holidayRoutes);

/* ================================
   404 HANDLER
================================ */

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */

app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;