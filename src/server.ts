import dotenv from "dotenv";
<<<<<<< HEAD
dotenv.config();
<<<<<<< HEAD

import app from "./app";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (error: any) => {
  console.error("Server failed to start:", error);
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

=======
import app from "./app";
import "./cron/autoPunchOut";
const PORT = process.env.PORT || 5000;

/* =====================================================
   START SERVER
===================================================== */
const server = app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});

/* =====================================================
   HANDLE SERVER ERRORS
===================================================== */
server.on("error", (error: any) => {
  console.error(" Server failed to start:", error);

  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  }

  process.exit(1);
});

/* =====================================================
   HANDLE UNCAUGHT EXCEPTIONS
===================================================== */
>>>>>>> origin/feature/attendance-wfh
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

<<<<<<< HEAD
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
=======
/* =====================================================
   HANDLE UNHANDLED PROMISE REJECTIONS
===================================================== */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
>>>>>>> origin/feature/attendance-wfh
=======
import app from "./app";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> origin/leave_management-API-kiruthika
