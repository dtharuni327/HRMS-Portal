import express from "express";
import employeeRoutes from "./routes/employeeRoutes";
import testAuthRoutes from "./routes/testAuth"; // add this

const app = express();

app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api", testAuthRoutes); // add this

export default app;