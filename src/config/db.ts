import sql from "mssql";
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
export const db = new sql.ConnectionPool(
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