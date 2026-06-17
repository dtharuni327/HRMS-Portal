import { updateProjectEffort as updateProjectEffortRepo } from "../../repositories/projectEffort/updateProjectEffort";

export const updateProjectEffort = async (
  effortId: number,
  data: any
) => {
  return await updateProjectEffortRepo(effortId, data);

};