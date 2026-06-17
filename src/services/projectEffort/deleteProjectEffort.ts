import { deleteProjectEffort as deleteProjectEffortRepo } from "../../repositories/projectEffort/deleteProjectEffort";

export const deleteProjectEffort = async (effortId: number) => {

  return await deleteProjectEffortRepo(effortId);
  
};