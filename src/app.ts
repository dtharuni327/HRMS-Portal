import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import departmentRoutes from "./routes/department.routes"; 
import roleRoutes from "./routes/role.routes";             

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