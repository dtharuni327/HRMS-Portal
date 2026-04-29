import app from "./app";

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
  console.error("❌ Server failed to start:", error);

  if (error.code === "EADDRINUSE") {
    console.error(`⚠️ Port ${PORT} is already in use`);
  }

  process.exit(1);
});

/* =====================================================
   HANDLE UNCAUGHT EXCEPTIONS
===================================================== */
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

/* =====================================================
   HANDLE UNHANDLED PROMISE REJECTIONS
===================================================== */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});