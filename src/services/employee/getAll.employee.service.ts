import sql from "mssql";
import { getAllEmployeesRepo } from "../../repositories/employee/employee.repository";
import { ROLES } from "../../middleware/role.middleware";
import { PAGINATION } from "../../constants/employee.constants";
import { GetAllEmployeeQuery } from "../../validations/employee/getAll.employee.validation";

interface GetAllOptions extends GetAllEmployeeQuery {
  userRole?: string;
  userEmpId?: string;
}

export const getAllEmployeesService = async (options: GetAllOptions) => {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    search, department, role, status,
    userRole, userEmpId,
  } = options;

  const isManager = userRole === ROLES.MANAGER;

  const result = await getAllEmployeesRepo({
    page, limit, search, department, role, status, userEmpId, isManager,
  });

  const recordsets = result.recordsets as sql.IRecordSet<any>[]; // SP returns [0] employee rows, [1] total count
  const employees = recordsets[0];
  const total = recordsets[1][0].total;

  return {
    employees,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};