import { updateJobRepo } from "../../repositories/recruitment/recruitment.repository";
import { UpdateJobInput } from "../../validations/recruitment/update.job.validation";

const parseSkills = (row: any) => {
  if (!row) return row;
  try { return { ...row, skills: row.skills ? JSON.parse(row.skills) : [] }; }
  catch { return { ...row, skills: [] }; }
};

export const updateJobService = async (id: number, data: UpdateJobInput) => {
  const result = await updateJobRepo(id, data);
  return parseSkills(result.recordset[0]); // SP returns updated row; throws on not-found
};
