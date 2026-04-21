import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Adhvik@1905",
  database: "hrms_portal"
});