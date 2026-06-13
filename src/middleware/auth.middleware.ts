import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import sql from "mssql"; // Fixed: Added back the correct string quotes
import { db } from "../config/db";

interface CustomUser extends JwtPayload {
  Emp_id: string;
}

export interface AuthRequest extends Request {
  user?: {
    Emp_id: string;
    role: string; // Dynamic field holding 'SUPER_ADMIN', 'HR_ADMIN', etc.
    Dashboard_id?: number;  // ← ADD THIS

  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
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
        message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }

    if (!decoded?.Emp_id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const pool = await db;
    
    // Kept strictly to MSSQL, completely removed 'active' to stop the column error
    const result = await pool.request()
      .input("Emp_id", sql.VarChar(10), decoded.Emp_id)
      .query(`
        SELECT 
          e.Emp_id,
          acc.DashboardName
        FROM Employee e
        INNER JOIN Access acc ON e.Dashboard_id = acc.Id
        WHERE e.Emp_id = @Emp_id
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Employee profile processing failed" });
    }

    const user = result.recordset[0];

    // Safety check to verify DashboardName exists in the database record
    if (!user.DashboardName) {
      return res.status(401).json({ message: "Dashboard access configuration missing for this profile" });
    }

    req.user = {
      Emp_id: user.Emp_id,
      // Standardize formatting cleanly (e.g., "HR Manager" or "HR Admin" -> "HR_ADMIN")
      role: String(user.DashboardName).toUpperCase().trim().replace(/\s+/g, "_"), 
    };

    next();
  } catch (error) {
    console.error("JWT Verification Middleware Issue:", error);
    return res.status(500).json({ 
      message: "Authentication failed",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
