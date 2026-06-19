import sql from "mssql";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

const requiredEnv = ["DB_SERVER", "DB_USER", "DB_PASSWORD", "DB_NAME"];
=======

/* =====================================================
   ENV VALIDATION
===================================================== */

const requiredEnv = [
  "DB_SERVER",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME"
];
>>>>>>> origin/feature/attendance-wfh

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

<<<<<<< HEAD
=======
/* =====================================================
   MSSQL CONFIG
===================================================== */

>>>>>>> origin/feature/attendance-wfh
const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_NAME,
<<<<<<< HEAD
=======

>>>>>>> origin/feature/attendance-wfh
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

<<<<<<< HEAD

export const db: Promise<sql.ConnectionPool> = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("MSSQL Connected");
    return pool;
  })
  .catch((err) => {
    console.error("DB Connection Error:", err);
    throw err;
  });
=======
=======
>>>>>>> origin/leave_management-API-kiruthika
import { env } from "./env";
const dbConfig: sql.config = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_SERVER,
  database: env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};
<<<<<<< HEAD
export const db = new sql.ConnectionPool(
  dbConfig
)
.connect()
.then(pool => {
  console.log(
    "✅ SQL Server Connected"
  );
  return pool;
})
.catch(error => {
  console.error(
    "❌ Database Connection Failed",
    error
  );
  throw error;
});
export default db;
>>>>>>> origin/feature/department-roles
=======
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
>>>>>>> origin/feature/attendance-wfh
=======
export const db =
  new sql.ConnectionPool(
    dbConfig
  )
    .connect()
    .then(pool => {
      console.log(
        "SQL Server Connected"
      );
      return pool;
    })
    .catch(error => {
      console.error(
        "Database Connection Failed",
        error
      );
      throw error;
    });

export default db;
>>>>>>> origin/leave_management-API-kiruthika
