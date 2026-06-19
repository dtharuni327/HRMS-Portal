import { Request, Response } from "express";
import { runHealthChecks, getMetrics } from "../../services/systemHealth/systemHealth.service";
import {
  checkDatabaseHealth,
  checkApiHealth,
  getActiveSessions,
  getErrorRate,
  getBackupStatus,
  getHealthConfig,
  createHealthConfig,
  updateHealthConfig
} from "../../services/systemHealth/systemHealth.service";
import { SYSTEM_HEALTH_MESSAGES } from "../../constants/systemHealth.constants";

export const getSystemStatus = async (req: Request, res: Response) => {
  try {
    const baseHost = `${req.protocol}://${req.get("host")}`;
    const report = await runHealthChecks(baseHost);
    return res.status(200).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: report });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSystemMetrics = (_req: Request, res: Response) => {
  try {
    const metrics = getMetrics();
    return res.status(200).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: metrics });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkDatabase = async (_req: Request, res: Response) => {
  try {
    const status = await checkDatabaseHealth();
    return res.status(200).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: status });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkApi = async (req: Request, res: Response) => {
  try {
    const { url } = req.query;
    if (!url || typeof url !== "string") return res.status(400).json({ message: "Query param 'url' is required" });
    const baseHost = `${req.protocol}://${req.get("host")}`;
    const result = await checkApiHealth(url, baseHost);
    return res.status(200).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: result });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const activeSessions = (_req: Request, res: Response) => {
  try {
    const count = getActiveSessions();
    return res.status(200).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: { activeSessions: count } });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const errorRate = (_req: Request, res: Response) => {
  try {
    const rate = getErrorRate();
    return res.status(200).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: { errorRate: rate } });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const backupStatus = (_req: Request, res: Response) => {
  try {
    const status = getBackupStatus();
    return res.status(200).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: status });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHealthConfiguration = (_req: Request, res: Response) => {
  try {
    const cfg = getHealthConfig();
    return res.status(200).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: cfg });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createHealthConfiguration = (req: Request, res: Response) => {
  try {
    const cfg = createHealthConfig(req.body, req.user);
    return res.status(201).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: cfg });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateHealthConfiguration = (req: Request, res: Response) => {
  try {
    const cfg = updateHealthConfig(req.body, req.user);
    return res.status(200).json({ message: SYSTEM_HEALTH_MESSAGES.OK, data: cfg });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
