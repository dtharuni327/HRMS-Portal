import { getProjectEffortById as getProjectEffortByIdRepo } from "../../repositories/projectEffort/getProjectEffortById";

export const getProjectEffortById = async (effortId: number) => {

  return await getProjectEffortByIdRepo(effortId);
  
};