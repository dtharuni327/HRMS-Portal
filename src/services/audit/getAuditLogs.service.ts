import { getAuditLogsRepository }
from "../../repositories/audit/getAuditLogs.repository";
export const getAuditLogsService =
async () => {
  const result =
    await getAuditLogsRepository();
  return {
    success: true,
    message: "Audit logs fetched successfully",
    data: result.recordset
  };
};