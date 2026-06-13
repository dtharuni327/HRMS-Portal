import sql from "mssql";

/* =====================================================
   ENV VALIDATION
===================================================== */

const requiredEnv = [
  "DB_SERVER",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

/* =====================================================
   MSSQL CONFIG
===================================================== */

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_NAME,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

/* =====================================================
   DB CONNECTION
===================================================== */

export const db = new sql.ConnectionPool(config);

db.connect()
  .then(() => {
    console.log("MSSQL Connected");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });