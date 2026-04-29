export const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {

    // Super Admin full access
    if (req.user?.role === "SUPER_ADMIN") {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ Message: "Access Denied" });
    }

    next();
  };
};