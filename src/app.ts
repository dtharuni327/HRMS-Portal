import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

import employeeRoutes from "./routes/employeeRoutes";

dotenv.config();

const app = express();

/* =====================================================
   MIDDLEWARE
===================================================== */
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

/* =====================================================
   HEALTH CHECK
===================================================== */
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

/* =====================================================
   ROUTES
===================================================== */
app.use("/api/employees", employeeRoutes);

/* =====================================================
   404 HANDLER
===================================================== */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;