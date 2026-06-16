import dotenv from "dotenv";
dotenv.config();
export const env = {
  PORT: process.env.PORT || "5000",
  DB_USER: process.env.DB_USER || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_SERVER: process.env.DB_SERVER || "",
  DB_DATABASE: process.env.DB_DATABASE || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN:
    process.env.JWT_EXPIRES_IN || "1d",
  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_PASSWORD:
    process.env.MAIL_PASSWORD || "",
  FRONTEND_URL:
    process.env.FRONTEND_URL || ""
};