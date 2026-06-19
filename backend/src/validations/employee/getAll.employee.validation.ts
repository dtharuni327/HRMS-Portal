import { z } from "zod";
import { EMPLOYEE_STATUS, PAGINATION } from "../../constants/employee.constants";

const employeeStatusValues = Object.values(EMPLOYEE_STATUS) as [string, ...string[]];

export const getAllEmployeeSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),

    limit: z.coerce
      .number().int().min(1)
      .max(PAGINATION.MAX_LIMIT)
      .default(PAGINATION.DEFAULT_LIMIT),

    search: z.string().trim().min(1).max(100).optional(),
    department: z.string().trim().min(1).max(100).optional(),
    role: z.string().trim().min(1).max(100).optional(),

    status: z
      .string().trim().toUpperCase() // normalise before enum check
      .pipe(z.enum(employeeStatusValues as [string, ...string[]]))
      .optional(),
  })
  .strict();

export type GetAllEmployeeQuery = z.infer<typeof getAllEmployeeSchema>;