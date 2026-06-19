import { z } from "zod";
import { EMPLOYEE_STATUS, EMPLOYMENT_TYPE, WORK_MODE, GENDER } from "../../constants/employee.constants";

const employeeStatusValues = Object.values(EMPLOYEE_STATUS) as [string, ...string[]];
const employmentTypeValues = Object.values(EMPLOYMENT_TYPE) as [string, ...string[]];
const workModeValues = Object.values(WORK_MODE) as [string, ...string[]];
const genderValues = Object.values(GENDER) as [string, ...string[]];

export const updateEmployeeSchema = z // all fields optional; only provided fields are updated
  .object({
    name: z
      .string().trim().min(2).max(100)
      .optional(),

    personal_email: z
      .string().trim().toLowerCase().email("Invalid email format")
      .optional(),

    phone: z
      .string().trim().regex(/^[0-9]{10}$/, "Phone must be 10 digits")
      .optional(),

    emergency_contact: z
      .string().trim().regex(/^[0-9]{10}$/, "Emergency contact must be 10 digits")
      .optional(),

    DOB: z
      .string().trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be YYYY-MM-DD")
      .optional(),

    Gender: z.enum(genderValues as [string, ...string[]]).optional(),

    profile_image: z
      .string().trim().url("profile_image must be a valid URL")
      .optional(),

    designation: z
      .string().trim().min(2).max(100)
      .optional(),

    employment_type: z.enum(employmentTypeValues as [string, ...string[]]).optional(),
    work_mode: z.enum(workModeValues as [string, ...string[]]).optional(),
    employee_status: z.enum(employeeStatusValues as [string, ...string[]]).optional(),

    manager_id: z
      .string().trim().min(1, "Manager ID cannot be empty")
      .optional(),

    department_id: z.number().int().positive("Department ID must be positive").optional(),
    client_id: z.number().int().positive("Client ID must be positive").optional(),
    role_id: z.number().int().positive("Role ID must be positive").optional(),
  })
  .strict();

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;