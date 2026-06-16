import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import employeeRoutes from "./routes/employee.routes";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profile.routes";
import recruitmentRoutes from "./routes/recruitment.routes";
import documentsRoutes from "./routes/documents.routes";
import teamDirectoryRoutes from "./routes/teamDirectory.routes";
import organisationRoutes from "./routes/organisation.routes";

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
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/team-directory", teamDirectoryRoutes);
app.use("/api/organisation", organisationRoutes);

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