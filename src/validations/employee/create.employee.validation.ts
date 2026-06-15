import { z } from "zod";
import { EMPLOYEE_STATUS, EMPLOYMENT_TYPE, WORK_MODE, GENDER } from "../../constants/employee.constants";

const employeeStatusValues = Object.values(EMPLOYEE_STATUS) as [string, ...string[]];
const employmentTypeValues = Object.values(EMPLOYMENT_TYPE) as [string, ...string[]];
const workModeValues = Object.values(WORK_MODE) as [string, ...string[]];
const genderValues = Object.values(GENDER) as [string, ...string[]];

export const createEmployeeSchema = z
  .object({
    name: z
      .string().trim()
      .min(1, "Name is required")
      .max(100, "Name exceeds maximum length"),

    personal_email: z
      .string().trim().toLowerCase()
      .email("Invalid email format"),

    phone: z
      .string().trim()
      .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),

    emergency_contact: z
      .string().trim()
      .regex(/^[0-9]{10}$/, "Invalid emergency contact number")
      .nullable()
      .optional(),

    DOB: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be YYYY-MM-DD"),

    Gender: z.enum(genderValues as [string, ...string[]]),

    RoleID: z.number().int().positive("RoleID must be positive"),
    Department_id: z.number().int().positive("Department_id must be positive"),
    Dashboard_id: z.number().int().positive("Dashboard_id must be positive"),

    client_id: z
      .number().int().positive("client_id must be positive")
      .nullable().optional(),

    manager_id: z
      .string().trim().min(1, "Manager ID cannot be empty")
      .nullable().optional(),

    designation: z
      .string().trim()
      .min(1, "Designation is required")
      .max(100, "Designation exceeds maximum length"),

    joining_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "joining_date must be YYYY-MM-DD"),

    employment_type: z.enum(employmentTypeValues as [string, ...string[]]),
    work_mode: z.enum(workModeValues as [string, ...string[]]),

    employee_status: z
      .enum(employeeStatusValues as [string, ...string[]])
      .default(EMPLOYEE_STATUS.ACTIVE),

    profile_image: z.string().trim().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const parsedDate = new Date(data.joining_date);

    if (isNaN(parsedDate.getTime())) { // regex passes format but new Date() can still produce NaN
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["joining_date"],
        message: "Invalid joining_date",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // zero out time to avoid false positives against today

    if (parsedDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["joining_date"],
        message: "Joining date cannot be a future date",
      });
    }

    const parsedDob = new Date(data.DOB);

    if (isNaN(parsedDob.getTime())) { // regex passes format but new Date() can still produce NaN
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DOB"],
        message: "Invalid DOB",
      });
    } else {
      if (parsedDob > today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["DOB"],
          message: "DOB cannot be a future date",
        });
      }

      const minAgeDate = new Date(today);
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 18); // minimum working age

      if (parsedDob > minAgeDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["DOB"],
          message: "Employee must be at least 18 years old",
        });
      }
    }

    if (data.emergency_contact && data.phone === data.emergency_contact) { // skipped when field is absent
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergency_contact"],
        message: "Emergency contact cannot be same as phone",
      });
    }
  })
  .strict();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;