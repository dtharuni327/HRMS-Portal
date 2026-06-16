import { applyToJobRepo } from "../../repositories/recruitment/recruitment.repository";
import { ApplyToJobInput } from "../../validations/recruitment/apply.job.validation";

export const applyToJobService = async (
  jobId: number,
  appliedByEmpId: string,
  data: ApplyToJobInput,
) => {
  const result = await applyToJobRepo(jobId, appliedByEmpId, data);
  return result.recordset[0]; // SP throws JOB_CLOSED / ALREADY_APPLIED via RAISERROR
};
