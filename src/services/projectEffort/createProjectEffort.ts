import { createProjectEffort as createProjectEffortRepo } from "../../repositories/projectEffort/createProjectEffort";

export const createProjectEffort = async (data: any) => {

  return await createProjectEffortRepo(data);
  
};