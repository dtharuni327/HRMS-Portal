import { Request, Response } from "express";
import {db} from "../config/db";
import sql from "mssql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
 
/* =====================================================
   REGISTER
===================================================== */
 
export const register = async (
  req: Request,
  res: Response
) => {
 
  try {
 
    const {
      username,
      password
    } = req.body;
 
    /* =========================
       VALIDATION
    ========================= */
 
    if (!username || !password) {
 
      return res.status(400).json({
        message:
          "Username and password are required",
      });
    }
 
    /* =========================
       PASSWORD VALIDATION
    ========================= */
 
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/;
 
    if (!passwordRegex.test(password)) {
 
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character (@#$%^&*!?)"
      });
 
    }
 
    const pool = await db;
 
    /* =========================
       GET EMPLOYEE DATA
    ========================= */
 
    const employeeResult =
      await pool.request()
 
        .input(
          "username",
          sql.VarChar,
          username
        )
 
        .query(`
          SELECT
            Emp_id,
            name,
            username,
            company_email,
            phone,
            client_id
          FROM Employee
          WHERE username = @username
        `);
 
    /* =========================
       EMPLOYEE NOT FOUND
    ========================= */
 
    if (
      employeeResult.recordset.length === 0
    ) {
 
      return res.status(404).json({
        message:
          "Employee not found",
      });
    }
 
    const emp =
      employeeResult.recordset[0];
 
    /* =========================
       CHECK ALREADY REGISTERED
    ========================= */
 
    const existing =
      await pool.request()
 
        .input(
          "Emp_id",
          sql.VarChar,
          emp.Emp_id
        )
 
        .query(`
          SELECT *
          FROM authentication
          WHERE Emp_id = @Emp_id
        `);
 
    if (
      existing.recordset.length > 0
    ) {
 
      return res.status(400).json({
        message:
          "Already registered",
      });
    }
 
    /* =========================
       HASH PASSWORD
    ========================= */
 
    const hashedPassword =
      await bcrypt.hash(password, 10);
 
    /* =========================
       INSERT INTO AUTH TABLE
    ========================= */
 
    await pool.request()
 
      .input(
        "name",
        sql.VarChar,
        emp.name
      )
 
      .input(
        "username",
        sql.VarChar,
        emp.username
      )
 
      .input(
        "company_email",
        sql.VarChar,
        emp.company_email
      )
 
      .input(
        "password",
        sql.VarChar,
        hashedPassword
      )
 
      .input(
        "Emp_id",
        sql.VarChar,
        emp.Emp_id
      )
 
      .input(
        "client_id",
        sql.Int,
        emp.client_id || null
      )
 
      .input(
        "phone",
        sql.VarChar,
        emp.phone || null
      )
 
      .input(
        "active",
        sql.Bit,
        1
      )
 
      .query(`
        INSERT INTO authentication
        (
          name,
          username,
          company_email,
          password,
          Emp_id,
          client_id,
          phone,
          active,
          email_verified
        )
 
        VALUES
        (
          @name,
          @username,
          @company_email,
          @password,
          @Emp_id,
          @client_id,
          @phone,
          @active,
          0
        )
      `);
 
    /* =========================
       SUCCESS RESPONSE
    ========================= */
 
    return res.status(201).json({
      success: true,
      message: "Register successful",
      employee: {
        Emp_id: emp.Emp_id,
        username: emp.username,
        company_email: emp.company_email
      }
    });
 
  } catch (err: any) {
 
    console.log(
      "Register Error:",
      err
    );
 
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};
/* =====================================================
   LOGIN
===================================================== */
 
export const login = async (
  req: Request,
  res: Response
) => {
 
  try {
 
    const {
      username,
      password
    } = req.body;
 
    /* =========================
       VALIDATION
    ========================= */
 
    if (!username || !password) {
 
      return res.status(400).json({
        message:
          "username and password are required",
      });
    }
 
    const pool = await db;
 
    /* =========================
       GET USER
    ========================= */
 
    const result =
      await pool.request()
 
        .input(
          "username",
          sql.VarChar,
          username
        )
 
        .query(`
          SELECT
            a.password,
            a.active,
            a.refresh_token,
 
            e.Name,
            e.company_email,
            e.Phone,
            e.Emp_id,
            e.RoleID,
            e.username,
 
            r.role_name,
            acc.DashboardName
           
            FROM authentication a
 
            INNER JOIN employee e
            ON a.Emp_id = e.Emp_id
 
            INNER JOIN roles r
            ON e.RoleID = r.id
           
            INNER JOIN Access acc
            ON e.Dashboard_id = acc.id
           
            WHERE
            e.username = @username
 
          AND a.active = 1
        `);
 
    if (
      result.recordset.length === 0
    ) {
 
      return res.status(404).json({
        message:
          "User not found",
      });
    }
 
    const user =
      result.recordset[0];
 
    /* =========================
       PASSWORD CHECK
    ========================= */
 
    const match =
      await bcrypt.compare(
        password,
        user.password
      );
 
    if (!match) {
 
      return res.status(401).json({
        message:
          "Wrong password",
      });
    }
 
    /* =========================
       ACCESS TOKEN
    ========================= */
 
    const accessToken =
      jwt.sign(
        {
          Emp_id:
            String(user.Emp_id),
 
          role:
          user.DashboardName
        },
 
        process.env.JWT_SECRET as string,
 
        {
          expiresIn: "15m",
        }
      );
 
    /* =========================
       REFRESH TOKEN
    ========================= */
 
    const refreshToken =
      jwt.sign(
        {
          Emp_id:
            user.Emp_id,
        },
 
        process.env.JWT_REFRESH_SECRET as string,
 
        {
          expiresIn: "7d",
        }
      );
 
    /* =========================
       SAVE REFRESH TOKEN
    ========================= */
 
    await pool.request()
 
      .input(
        "refresh_token",
        sql.VarChar,
        refreshToken
      )
 
      .input(
        "Emp_id",
        sql.VarChar,
        String(user.Emp_id)
      )
 
      .query(`
        UPDATE authentication
 
        SET refresh_token = @refresh_token
 
        WHERE Emp_id = @Emp_id
      `);
 
    /* =========================
       RESPONSE
    ========================= */
 
    return res.status(200).json({
 
      message:
        "Login successful",
 
      accessToken,
 
      refreshToken,
 
      user: {
 
        name:
          user.Name,
 
        username:
          user.username,
 
        email:
          user.company_email,
 
        Emp_id:
          user.Emp_id,
 
        role: user.DashboardName,
        display_role: user.role_name
      },
    });
 
  } catch (err) {
 
    console.log(err);
 
    return res.status(500).json({
      message:
        "Server Error",
    });
  }
};
 
/* =====================================================
   FORGOT PASSWORD
===================================================== */
 
export const forgotPassword = async (
  req: Request,
  res: Response
) => {
 
  try {
 
    const { company_email } = req.body;
 
    if (!company_email) {
 
      return res.status(400).json({
        message: "company_email is required",
      });
    }
 
    const pool = await db;
 
    const result = await pool.request()
 
      .input(
        "company_email",
        sql.VarChar,
        company_email
      )
 
      .query(`
        SELECT
          a.*,
          e.company_email
 
        FROM authentication a
 
        JOIN Employee e
          ON a.Emp_id = e.Emp_id
 
        WHERE e.company_email = @company_email
      `);
 
    if (result.recordset.length === 0) {
 
      return res.status(404).json({
        message: "User not found",
      });
    }
 
    const user = result.recordset[0];
 
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
 
    await pool.request()
 
      .input("otp", sql.VarChar, otp)
 
      .input(
        "Emp_id",
        sql.VarChar,
        user.Emp_id
      )
 
      .query(`
        UPDATE authentication
 
        SET
        reset_otp = @otp,
        reset_otp_expires = DATEADD(MINUTE,15,GETDATE())
 
        WHERE Emp_id = @Emp_id
      `);
 
    const transporter =
      nodemailer.createTransport({
        service: "gmail",
 
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
 
    await transporter.sendMail({
 
      from: process.env.MAIL_USER,
 
      to: company_email,
 
      subject: "HRMS Password Reset OTP",
 
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `,
    });
 
    return res.status(200).json({
      message: "OTP sent to email",
    });
 
  } catch (err) {
 
    console.log(err);
 
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
 
/* =====================================================
   RESET PASSWORD
===================================================== */
 
export const resetPassword = async (
  req: Request,
  res: Response
) => {
 
  try {
 
    const {
      company_email,
      otp,
      newPassword
    } = req.body;
 
    if (
      !company_email ||
      !otp ||
      !newPassword
    ) {
 
      return res.status(400).json({
        message:
          "company_email, otp and newPassword are required",
      });
    }
 
    const pool = await db;
 
    const result = await pool.request()
 
      .input(
        "company_email",
        sql.VarChar,
        company_email
      )
 
      .input(
        "otp",
        sql.VarChar,
        otp
      )
 
      .query(`
        SELECT
          a.*,
          e.company_email
 
        FROM authentication a
 
        JOIN Employee e
          ON a.Emp_id = e.Emp_id
 
        WHERE
          e.company_email = @company_email
 
        AND a.reset_otp = @otp
        AND a.reset_otp_expires > GETDATE()
      `);
 
    if (result.recordset.length === 0) {
 
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
 
    const user = result.recordset[0];
 
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);
 
    await pool.request()
 
      .input(
        "password",
        sql.VarChar,
        hashedPassword
      )
 
      .input(
        "Emp_id",
        sql.VarChar,
        user.Emp_id
      )
 
      .query(`
        UPDATE authentication
 
        SET
        password = @password,
        reset_otp = NULL,
        reset_otp_expires = NULL
 
        WHERE Emp_id = @Emp_id
      `);
 
    return res.status(200).json({
      message: "Password reset successful",
    });
 
  } catch (err) {
 
    console.log(err);
 
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
 
/* =====================================================
   SEND EMAIL VERIFICATION OTP
===================================================== */
 
export const sendEmailVerificationOtp = async (
  req: Request,
  res: Response
) => {
 
  try {
 
    const { company_email } = req.body;
 
    if (!company_email) {
 
      return res.status(400).json({
        message:
          "company_email is required",
      });
    }
 
    const pool = await db;
 
    const result = await pool.request()
 
      .input(
        "company_email",
        sql.VarChar,
        company_email
      )
 
      .query(`
        SELECT
          a.*,
          e.company_email
 
        FROM authentication a
 
        JOIN Employee e
          ON a.Emp_id = e.Emp_id
 
        WHERE e.company_email = @company_email
      `);
 
    if (result.recordset.length === 0) {
 
      return res.status(404).json({
        message: "User not found",
      });
    }
 
    const user = result.recordset[0];
 
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
 
    await pool.request()
 
      .input(
        "otp",
        sql.VarChar,
        otp
      )
 
      .input(
        "Emp_id",
        sql.VarChar,
        user.Emp_id
      )
 
      .query(`
        UPDATE authentication
 
        SET verify_email_token = @otp
 
        WHERE Emp_id = @Emp_id
      `);
 
    const transporter =
      nodemailer.createTransport({
        service: "gmail",
 
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
 
    await transporter.sendMail({
 
      from: process.env.MAIL_USER,
 
      to: company_email,
 
      subject: "Email Verification OTP",
 
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `,
    });
 
    return res.status(200).json({
      message: "OTP sent successfully",
    });
 
  } catch (err) {
 
    console.log(err);
 
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
 
/* =====================================================
   VERIFY EMAIL OTP
===================================================== */
 
export const verifyEmailOtp = async (
  req: Request,
  res: Response
) => {
 
  try {
 
    const {
      company_email,
      otp
    } = req.body;
 
    if (
      !company_email ||
      !otp
    ) {
 
      return res.status(400).json({
        message:
          "company_email and otp are required",
      });
    }
 
    const pool = await db;
 
    const result = await pool.request()
 
      .input(
        "company_email",
        sql.VarChar,
        company_email
      )
 
      .input(
        "otp",
        sql.VarChar,
        otp
      )
 
      .query(`
        SELECT
          a.*,
          e.company_email
 
        FROM authentication a
 
        JOIN Employee e
          ON a.Emp_id = e.Emp_id
 
        WHERE
          e.company_email = @company_email
 
        AND a.verify_email_token = @otp
      `);
 
    if (result.recordset.length === 0) {
 
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
 
    const user = result.recordset[0];
 
    await pool.request()
 
      .input(
        "Emp_id",
        sql.VarChar,
        user.Emp_id
      )
 
      .query(`
        UPDATE authentication
 
        SET
          email_verified = 1,
          verify_email_token = NULL
 
        WHERE Emp_id = @Emp_id
      `);
 
    return res.status(200).json({
      message:
        "Email verified successfully",
    });
 
  } catch (err) {
 
    console.log(err);
 
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
 
/* =====================================================
   REFRESH ACCESS TOKEN
===================================================== */
 
export const refreshAccessToken = async (
  req: Request,
  res: Response
) => {
 
  try {
 
    const { refreshToken } = req.body;
 
    if (!refreshToken) {
 
      return res.status(401).json({
        message:
          "Refresh token required",
      });
    }
 
    const decoded: any =
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      );
 
    const pool = await db;
 
    const result =
      await pool.request()
 
        .input(
          "Emp_id",
          sql.VarChar,
          decoded.Emp_id
        )
 
        .input(
          "refresh_token",
          sql.VarChar,
          refreshToken
        )
 
        .query(`
          SELECT *
 
          FROM authentication
 
          WHERE
            Emp_id = @Emp_id
 
          AND refresh_token = @refresh_token
        `);
 
    if (
      result.recordset.length === 0
    ) {
 
      return res.status(403).json({
        message:
          "Invalid refresh token",
      });
    }
 
    const user =
      result.recordset[0];
 
    const newAccessToken =
      jwt.sign(
        {
          Emp_id:
            user.Emp_id,
        },
 
        process.env.JWT_SECRET as string,
 
        {
          expiresIn: "15m",
        }
      );
 
    return res.status(200).json({
      accessToken:
        newAccessToken,
    });
 
  } catch (err) {
    console.log(err);
 
    return res.status(403).json({
      message:
        "Invalid token",
    });
  }
};