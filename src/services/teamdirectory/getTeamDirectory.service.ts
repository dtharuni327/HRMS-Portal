import { getTeamDirectoryRepo } from "../../repositories/teamdirectory/teamDirectory.repository";
import { GetTeamDirectoryQuery } from "../../validations/teamdirectory/getTeamDirectory.validation";

interface GetTeamOptions extends GetTeamDirectoryQuery {
  loggedInEmpId: string;
  loggedInRole:  string;
}

// SP returns flat rows; group them by department for the frontend
// which renders one card per department (TeamDirectoryModule.tsx)
const groupByDepartment = (rows: any[]) => {
  const map: Record<string, any[]> = {};

  for (const row of rows) {
    const dept = row.dept;
    if (!map[dept]) map[dept] = [];
    map[dept].push(row);
  }

  return Object.entries(map).map(([dept, employees]) => ({
    dept,
    employeeCount: employees.length,
    employees,
  }));
};

export const getTeamDirectoryService = async (options: GetTeamOptions) => {
  const result = await getTeamDirectoryRepo(options);
  return groupByDepartment(result.recordset);
};
