import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Routes
import attendanceRoutes from "./routes/attendanceRoutes";

// Cron job (keep here so it runs when app loads)
import "./config/cron";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/attendance", attendanceRoutes);

export default app;