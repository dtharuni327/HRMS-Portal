import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/",(req,res)=>{
    res.send("API Working");
});

export default app;
