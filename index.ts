import express from "express";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());

// ✅ CONNECT ROUTES
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("Server working ✅");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});