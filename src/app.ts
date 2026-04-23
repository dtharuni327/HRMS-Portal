import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.send("Server Working");
});

//CONNECT ROUTES
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

export default app;