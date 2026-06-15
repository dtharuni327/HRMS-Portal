import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authenticationRoutes from "./routes/authentication.routes";
import holidayRoutes from "./routes/holiday.routes";
import leaveRoutes from "./routes/leave.routes";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.get("/",
  (req,res) => {
    res.status(200).json({
      success: true,
      message: "HRMS API Running Successfully"
    });
  }
);
app.use("/auth",authenticationRoutes);
app.use("/holiday",holidayRoutes);
app.use("/leave",leaveRoutes);
app.use(
  (error: any,req: any,res: any,next: any) => {
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