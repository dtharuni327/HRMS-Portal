import { Request, Response, NextFunction } from "express";
import { getAuditLogsService } 
from "../../services/audit/getAuditLogs.service";
export const getAuditLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result =
      await getAuditLogsService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};