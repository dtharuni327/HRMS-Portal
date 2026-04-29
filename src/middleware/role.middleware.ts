import { Request, Response, NextFunction } from "express";

export const authorize = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {

    // Super Admin full access
    if (req.user?.role === "SUPER_ADMIN") {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
};