import express from "express";
import cors from "cors";
import attendanceRoutes from "./routes/attendanceRoutes";

import dotenv from "dotenv";

dotenv.config();

// Import cron job (important)
import "./config/cron";

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});