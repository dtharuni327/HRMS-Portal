import { getMyProfileRepo } from "../../repositories/profile/profile.repository";

export const getMyProfileService = async (empId: string) => {
  const result = await getMyProfileRepo(empId);
  return result.recordset[0] ?? null; // null → 404 "Profile not found"
};
