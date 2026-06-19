import { getJobByIdRepo } from "../../repositories/recruitment/recruitment.repository";

const parseSkills = (row: any) => {
  if (!row) return row;
  try { return { ...row, skills: row.skills ? JSON.parse(row.skills) : [] }; }
  catch { return { ...row, skills: [] }; }
};

export const getJobByIdService = async (id: number) => {
  const result = await getJobByIdRepo(id);
  return parseSkills(result.recordset[0] ?? null); // null → 404
};
