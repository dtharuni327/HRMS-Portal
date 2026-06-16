import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "HRMS API Running Successfully"
  });
});

/* Routes */
import leaveRoutes from "./routes/leave.routes";

app.use("/api/leave", leaveRoutes);

export default app;