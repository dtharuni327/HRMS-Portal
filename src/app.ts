import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json()); 

app.use("/api/users", userRoutes); 

export default app;

app.get("/", (req, res) => {
  res.send("API working");
});

app.use((req, res, next) => {
  console.log("🔥 Incoming:", req.method, req.url);
  next();
});