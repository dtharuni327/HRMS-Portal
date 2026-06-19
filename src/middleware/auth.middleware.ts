<<<<<<< HEAD
<<<<<<< HEAD
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import sql from "mssql";
=======
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import sql from "mssql"; // Fixed: Added back the correct string quotes
>>>>>>> origin/feature/attendance-wfh
import { db } from "../config/db";

interface CustomUser extends JwtPayload {
  Emp_id: string;
}

export interface AuthRequest extends Request {
  user?: {
    Emp_id: string;
<<<<<<< HEAD
    role: string;
    Dashboard_id?: number;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

=======
    role: string; 
    Dashboard_id?: number;  
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
>>>>>>> origin/feature/attendance-wfh
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token required" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "fallback_secret";

    let decoded: CustomUser;
    try {
      decoded = jwt.verify(token, secret) as CustomUser;
    } catch (err: any) {
      return res.status(401).json({
<<<<<<< HEAD
        message:
          err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
=======
        message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
>>>>>>> origin/feature/attendance-wfh
      });
    }

    if (!decoded?.Emp_id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const pool = await db;
<<<<<<< HEAD
    const result = await pool
      .request()
      .input("Emp_id", sql.VarChar(12), decoded.Emp_id)
      .query(`
        SELECT e.Emp_id, acc.DashboardName
=======
    
    // GET Dashboard_id from database
    const result = await pool.request()
      .input("Emp_id", sql.VarChar(10), decoded.Emp_id)
      .query(`
        SELECT 
          e.Emp_id,
          e.Dashboard_id,
          acc.DashboardName
>>>>>>> origin/feature/attendance-wfh
        FROM Employee e
        INNER JOIN Access acc ON e.Dashboard_id = acc.Id
        WHERE e.Emp_id = @Emp_id
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Employee profile processing failed" });
    }

    const user = result.recordset[0];

    if (!user.DashboardName) {
<<<<<<< HEAD
      return res
        .status(401)
        .json({ message: "Dashboard access configuration missing for this profile" });
    }

    req.user = {
      Emp_id: user.Emp_id,
      role: String(user.DashboardName).toUpperCase().trim().replace(/\s+/g, "_"), // normalise DashboardName to SCREAMING_SNAKE role string
=======
      return res.status(401).json({ message: "Dashboard access configuration missing for this profile" });
    }

    // SAVE Dashboard_id to req.user
    req.user = {
      Emp_id: user.Emp_id,
      role: String(user.DashboardName).toUpperCase().trim().replace(/\s+/g, "_"),
      Dashboard_id: user.Dashboard_id,  // ← ADD THIS LINE
>>>>>>> origin/feature/attendance-wfh
    };

    next();
  } catch (error) {
<<<<<<< HEAD
    console.error("authenticate error:", error);
    return res.status(500).json({ message: "Authentication failed" });
=======
import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
export const authenticate = (req: any,res: Response,
  next: NextFunction) => {
  try {
    const authHeader =
      req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({success: false,
        message: "Token not provided"
      });
    }
    const token =authHeader.split(" ")[1];
    const decoded =jwt.verify(token,process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({success: false,message: "Invalid token"
    });
>>>>>>> origin/feature/department-roles
=======
    console.error("JWT Verification Middleware Issue:", error);
    return res.status(500).json({ 
      message: "Authentication failed",
      error: error instanceof Error ? error.message : String(error)
    });
>>>>>>> origin/feature/attendance-wfh
  }
};