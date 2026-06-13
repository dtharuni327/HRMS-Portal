import { Response, NextFunction } from "express";
import sql from "mssql";
import { db } from "../config/db";
import { AuthRequest } from "./auth.middleware";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  HR_ADMIN: "HR_ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  FINANCE: "FINANCE",
  CLIENT: "CLIENT",
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

// Normalize role name consistently across all functions
const normalizeRole = (role: string): string => {
  return role.trim().toUpperCase().replace(/\s+/g, "_");
};


export const authorize = (...roles: RoleType[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role?.toUpperCase()?.trim()?.replace(/\s+/g, "_");

      if (!userRole) {
        return res.status(401).json({ message: "Authentication context missing" });
      }

      // Universal priority access bypass logic for the Root Super Admin
      if (userRole === ROLES.SUPER_ADMIN) {
        return next();
      }

      const normalizedRoles = roles.map((role) => role.trim().toUpperCase().replace(/\s+/g, "_"));

      if (!normalizedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }

      next();
    } catch (error) {
      console.error("Authorization Guard Failure:", error);
      return res.status(500).json({ message: "Authorization processing failed" });
    }
  };
};


export const canAccessEmployeeData = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const empId = req.params.empId || req.params.id;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const role = user.role.trim().toUpperCase().replace(/\s+/g, "_");

    if (role === ROLES.SUPER_ADMIN || role === ROLES.HR_ADMIN) {
      return next();
    }

    if (user.Emp_id === empId) {
      return next();
    }

    if (role === ROLES.MANAGER) {
      const pool = await db;
      const teamResult = await pool.request()
        .input("empId", sql.VarChar, empId)
        .input("managerEmpId", sql.VarChar, user.Emp_id)
        .query(`
          SELECT Emp_id FROM Employee
          WHERE Emp_id = @empId AND manager_id = @managerEmpId
        `);

      if (teamResult.recordset.length > 0) {
        return next();
      }

      return res.status(403).json({ message: "Managers can access only their team members" });
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error("Employee Validation Verification Failure:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const canViewDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const role = user.role.trim().toUpperCase().replace(/\s+/g, "_");

    // SUPER_ADMIN and HR_ADMIN can view all dashboards
    if (role === ROLES.SUPER_ADMIN || role === ROLES.HR_ADMIN) {
      return next();
    }

    // MANAGER can view dashboard for their team
    if (role === ROLES.MANAGER) {
      return next();
    }


    // FINANCE can view attendance for financial reporting
    if (role === ROLES.FINANCE) {
      return next();
    }

    // CLIENT and others cannot access dashboard
    return res.status(403).json({ message: "Access denied. Insufficient dashboard permissions." });
  } catch (error) {
    console.error("Dashboard Access Verification Failure:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};