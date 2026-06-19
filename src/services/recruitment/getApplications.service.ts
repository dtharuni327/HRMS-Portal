import { getApplicationsRepo } from "../../repositories/recruitment/recruitment.repository";
import { GetApplicationsQuery } from "../../validations/recruitment/application.validation";

export const getApplicationsService = async (query: GetApplicationsQuery) => {
  const result = await getApplicationsRepo(query);
  return result.recordset;
};
