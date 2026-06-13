import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import employeeRoutes from "./routes/employee.routes";
import authRoutes from "./routes/authRoutes";

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

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);        // ← THIS LINE WAS MISSING

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;