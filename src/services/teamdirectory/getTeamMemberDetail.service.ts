import { getTeamMemberDetailRepo } from "../../repositories/teamdirectory/teamDirectory.repository";

interface GetMemberOptions {
  empId:         string;
  loggedInEmpId: string;
  loggedInRole:  string;
}

export const getTeamMemberDetailService = async (options: GetMemberOptions) => {
  const result = await getTeamMemberDetailRepo(options);
  const recordsets = result.recordsets as any[][];
  const profile    = recordsets?.[0]?.[0] ?? null; // null → 404
  const attendance = recordsets?.[1]       ?? [];

  if (!profile) return null;

  return { ...profile, recentAttendance: attendance };
};