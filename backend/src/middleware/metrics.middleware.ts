import { Request, Response, NextFunction } from "express";
import { systemHealthRepository } from "../repositories/systemHealth/systemHealth.repository";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationMs = diff[0] * 1000 + diff[1] / 1e6;
    const success = res.statusCode >= 200 && res.statusCode < 400;
    const route = req.route?.path || req.path;
    systemHealthRepository.incrementApiRequest(route, success, durationMs);
  });
  next();
};
