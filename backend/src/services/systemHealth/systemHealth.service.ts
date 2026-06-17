import { db } from "../../config/db";
import { systemHealthRepository } from "../../repositories/systemHealth/systemHealth.repository";
import { DEFAULT_MONITORED_APIS } from "../../constants/systemHealth.constants";
import http from "http";
import https from "https";

async function checkDb(): Promise<{ ok: boolean; info?: any }>{
  try {
    const pool = await db;
    await pool.request().query("SELECT 1 AS ok");
    return { ok: true };
  } catch (err: any) {
    return { ok: false, info: err.message };
  }
}

function pingUrl(url: string, baseHost: string): Promise<{ ok: boolean; status?: number }>{
  return new Promise((resolve) => {
    try {
      // support absolute and relative URLs
      const isAbsolute = url.startsWith("http://") || url.startsWith("https://");
      const full = isAbsolute ? url : `${baseHost}${url}`;
      const client = full.startsWith("https") ? https : http;
      const req = client.get(full, { timeout: 3000 }, (res) => {
        const ok = typeof res.statusCode === "number" ? res.statusCode < 400 : false;
        resolve({ ok, status: res.statusCode });
      });
      req.on("error", () => resolve({ ok: false }));
      req.on("timeout", () => { req.destroy(); resolve({ ok: false }); });
    } catch (e) {
      resolve({ ok: false });
    }
  });
}

export const runHealthChecks = async (baseHost: string = `http://localhost:${process.env.PORT || 3000}`) => {
  const dbCheck = await checkDb();
  const apiChecks = [] as any[];
  for (const api of DEFAULT_MONITORED_APIS) {
    const r = await pingUrl(api.url, baseHost);
    apiChecks.push({ name: api.name, url: api.url, ok: r.ok, status: r.status });
  }

  return {
    backend: { ok: true },
    database: dbCheck,
    apis: apiChecks,
    metrics: systemHealthRepository.getMetrics()
  };
};

export const getMetrics = () => {
  return systemHealthRepository.getMetrics();
};

export const setLastBackup = (ts: string) => {
  systemHealthRepository.setLastBackup(ts);
};

export const checkDatabaseHealth = async () => {
  return await checkDb();
};

export const checkApiHealth = async (url: string, baseHost: string = `http://localhost:${process.env.PORT || 3000}`) => {
  return await pingUrl(url, baseHost);
};

export const getActiveSessions = () => {
  return systemHealthRepository.getActiveSessions();
};

export const setActiveSessions = (count: number) => {
  return systemHealthRepository.setActiveSessions(count);
};

export const getErrorRate = () => {
  return systemHealthRepository.getErrorRate();
};

export const getBackupStatus = () => {
  return systemHealthRepository.getBackupStatus();
};

export const getHealthConfig = () => {
  return systemHealthRepository.getHealthConfig();
};

export const createHealthConfig = (data: any, user: any) => {
  const existing = systemHealthRepository.getHealthConfig();
  if (existing) throw new Error("Health configuration already exists. Update existing configuration instead.");
  return systemHealthRepository.setHealthConfig(data, user);
};

export const updateHealthConfig = (data: any, user: any) => {
  const existing = systemHealthRepository.getHealthConfig();
  if (!existing) throw new Error("Health configuration not found. Create one first.");
  return systemHealthRepository.setHealthConfig(data, user);
};
