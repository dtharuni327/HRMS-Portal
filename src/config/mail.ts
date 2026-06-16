import nodemailer from "nodemailer";
import { env } from "./env";
export const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASSWORD
    }
  });

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  return transporter.sendMail({
    from: env.MAIL_USER,
    to,
    subject,
    html
  });
};