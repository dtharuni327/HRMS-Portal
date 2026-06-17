import { getOrganisationStructureRepo } from "../../repositories/organisation/organisation.repository";
import { GetOrganisationQuery } from "../../validations/organisation/getOrganisation.validation";


const groupByDepartment = (rows: any[]) => {
  const map: Record<string, any[]> = {};

  for (const row of rows) {
    if (!map[row.dept]) map[row.dept] = [];
    map[row.dept].push(row);
  }

    return Object.keys(map)
    .sort()
    .map(dept => ({
      dept,
      employeeCount: map[dept].length,
      employees: map[dept],
    }));
};

export const getOrganisationStructureService = async (query: GetOrganisationQuery) => {
  const result = await getOrganisationStructureRepo(query);
  return groupByDepartment(result.recordset);
};
