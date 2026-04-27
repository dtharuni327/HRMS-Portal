import express from "express";
import authRoutes from "./routes/authRoutes";
import leaveRoutes from "./routes/leaveRoutes";
import holidayRoutes from "./routes/holidaysRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", leaveRoutes);
app.use("/api", holidayRoutes);

app.listen(5000, () => console.log("Server running"));