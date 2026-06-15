import { Response, NextFunction } from "express";

export const authorize = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userRole = req.user.role.toUpperCase();
    const allowedRoles = roles.map((role) => role.toUpperCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
};