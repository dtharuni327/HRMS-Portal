import express from "express";
import cors from "cors";
import attendanceRoutes from "./routes/attendanceRoutes";

import dotenv from "dotenv";

dotenv.config();

// Import cron job (important)
import "./config/cron";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/attendance", attendanceRoutes);

console.log("🔥 ROUTE HIT");
app.listen(5000, () => {
  console.log("Server running on port 5000");
});