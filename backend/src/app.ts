import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  attendanceRouter,
  authRouter,
  employeeRouter,
  holidayRouter,
  leaveRouter,
  utilityRouter,
  wfhRouter,
} from "./local/api";

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
app.use("/api/attendance", attendanceRouter);
app.use("/api/wfh", wfhRouter);
app.use("/api/holidays", holidayRouter);
app.use("/api/leave", leaveRouter);
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
