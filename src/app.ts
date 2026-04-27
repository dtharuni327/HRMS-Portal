import express from "express";
import employeeRoutes from "./routes/employeeRoutes";

const app = express();

app.use(express.json());

app.use("/api/employees", employeeRoutes);

export default app;