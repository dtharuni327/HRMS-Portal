import dotenv from "dotenv";
<<<<<<< HEAD

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",
  DB_SERVER: process.env.DB_SERVER || "localhost",
  DB_DATABASE: process.env.DB_DATABASE || "HRMS",
  DB_USER: process.env.DB_USER || "sa",
  DB_PASSWORD: process.env.DB_PASSWORD || "Root123",
  JWT_SECRET:
    process.env.JWT_SECRET || "hrms_jwt_secret_key",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "hrms_refresh_secret_key",
  MAIL_USER:
    process.env.MAIL_USER || "your_email@gmail.com",
  MAIL_PASSWORD:
    process.env.MAIL_PASSWORD || "your_email_app_password",
=======
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
>>>>>>> origin/leave_management-API-kiruthika
};