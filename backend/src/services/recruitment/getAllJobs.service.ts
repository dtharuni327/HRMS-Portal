import { getAllJobsRepo } from "../../repositories/recruitment/recruitment.repository";
import { GetAllJobsQuery } from "../../validations/recruitment/getJobs.validation";

const parseSkills = (row: any) => {
  if (!row) return row;
  try { return { ...row, skills: row.skills ? JSON.parse(row.skills) : [] }; }
  catch { return { ...row, skills: [] }; }
};

export const getAllJobsService = async (query: GetAllJobsQuery) => {
  const result = await getAllJobsRepo(query);
  return {
    jobs:  result.recordset.map(parseSkills),
    total: result.recordsets?.[1]?.[0]?.total ?? result.recordset.length,
  };
};
