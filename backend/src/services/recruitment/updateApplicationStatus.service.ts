import { updateApplicationStatusRepo } from "../../repositories/recruitment/recruitment.repository";
import { UpdateApplicationStatusInput } from "../../validations/recruitment/application.validation";

export const updateApplicationStatusService = async (
  applicationId: number,
  data: UpdateApplicationStatusInput,
) => {
  const result = await updateApplicationStatusRepo(applicationId, data);
  return result.recordset[0]; // SP throws APPLICATION_NOT_FOUND via RAISERROR if not found
};
