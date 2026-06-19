import { deleteJobRepo } from "../../repositories/recruitment/recruitment.repository";

export const deleteJobService = async (id: number) => {
  await deleteJobRepo(id); // SP throws JOB_NOT_FOUND via RAISERROR if not found
  return { deleted: true };
};
