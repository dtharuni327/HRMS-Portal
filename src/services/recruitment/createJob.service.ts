import { createJobRepo } from "../../repositories/recruitment/recruitment.repository";
import { CreateJobInput } from "../../validations/recruitment/create.job.validation";

export const createJobService = async (data: CreateJobInput, postedByEmpId: string) => {
  const result = await createJobRepo(data, postedByEmpId);
  const row = result.recordset[0];
  return { ...row, skills: data.skills ?? [] }; // skills were stored as JSON text; return as array
};
