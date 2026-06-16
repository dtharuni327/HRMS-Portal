import dotenv from "dotenv";
import app from "./app";
dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "127.0.0.1";

app.listen(Number(PORT), HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
