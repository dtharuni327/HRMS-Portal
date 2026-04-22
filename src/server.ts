import express from "express";
import cors from "cors";
import attendanceRoutes from "./routes/attendanceRoutes";

// Import cron job (important)
import "./config/cron";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", attendanceRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});