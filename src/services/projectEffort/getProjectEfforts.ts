import { getProjectEfforts as getProjectEffortsRepo } from "../../repositories/projectEffort/getProjectEfforts";

export const getProjectEfforts = async () => {
  return await getProjectEffortsRepo();
};