const metricsStore: any = {
  apiRequests: {
    total: 0,
    success: 0,
    failure: 0,
    byRoute: {}
  },
  errors: 0,
  lastBackup: null
};

export const systemHealthRepository = {
  incrementApiRequest(route: string, success: boolean, durationMs: number) {
    metricsStore.apiRequests.total += 1;
    if (success) metricsStore.apiRequests.success += 1;
    else metricsStore.apiRequests.failure += 1;

    const r = route || "unknown";
    metricsStore.apiRequests.byRoute[r] = metricsStore.apiRequests.byRoute[r] || { total: 0, success: 0, failure: 0, avgMs: 0 };
    const entry = metricsStore.apiRequests.byRoute[r];
    entry.total += 1;
    if (success) entry.success += 1; else entry.failure += 1;
    // running average
    entry.avgMs = ((entry.avgMs * (entry.total - 1)) + durationMs) / entry.total;
  },

  recordError() {
    metricsStore.errors += 1;
  },

  setLastBackup(timestamp: string) {
    metricsStore.lastBackup = timestamp;
  },

  // Active sessions tracking (in-memory). Integrate with real session store if available.
  setActiveSessions(count: number) {
    metricsStore.activeSessions = Number(count) || 0;
  },

  getActiveSessions() {
    return metricsStore.activeSessions ?? 0;
  },

  // Health configuration storage (single active config)
  setHealthConfig(config: any, user: any) {
    metricsStore.healthConfig = { ...config, updatedBy: user?.Emp_id ?? null, updatedAt: new Date().toISOString() };
    return metricsStore.healthConfig;
  },

  getHealthConfig() {
    return metricsStore.healthConfig ?? null;
  },

  // Error rate computed from stored metrics
  getErrorRate() {
    const total = metricsStore.apiRequests.total || 0;
    const failures = metricsStore.apiRequests.failure || 0;
    const percent = total > 0 ? (failures / total) * 100 : 0;
    return Number(percent.toFixed(2));
  },

  getBackupStatus() {
    return { lastBackup: metricsStore.lastBackup };
  },

  getMetrics() {
    return metricsStore;
  }
};
