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

export default app;