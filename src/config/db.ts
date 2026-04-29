import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

//  validation

if (!process.env.DB_HOST || 
    !process.env.DB_USER || 
    !process.env.DB_PASSWORD || 
    !process.env.DB_NAME) {
  throw new Error("Missing DB config: check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME");
}

export const db = mysql.createPool({

  //! Non-null assertion is safe because we validated env variables above
  host: process.env.DB_HOST!,                
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});