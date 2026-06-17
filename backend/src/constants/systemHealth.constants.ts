export const SYSTEM_HEALTH_MESSAGES = {
  OK: "OK",
  DB_UNAVAILABLE: "Database unavailable",
  API_UNAVAILABLE: "API endpoint unreachable",
  NOT_FOUND: "Not found"
};

export const DEFAULT_MONITORED_APIS = [
  { name: "Role API", url: "/role/all" },
  { name: "Department API", url: "/department/all" }
];
