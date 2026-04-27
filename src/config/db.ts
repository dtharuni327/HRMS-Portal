import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

//  validation
if (!process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD is not set in .env");
}

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});