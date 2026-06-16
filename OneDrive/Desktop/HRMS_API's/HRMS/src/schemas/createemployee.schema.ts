import { z } from "zod";

/* =====================================================
   ENUMS
===================================================== */

const employmentTypes = [
  "FULL_TIME",
  "CONTRACT",
  "INTERN",
] as const;

const workModes = [
  "WFH",
  "WFO",
  "HYBRID",
] as const;

const employeeStatuses = [
  "ACTIVE",
  "INACTIVE",
  "RESIGNED",
  "TERMINATED",
  "ON_NOTICE",
] as const;

/* =====================================================
   CREATE EMPLOYEE SCHEMA
===================================================== */

export const createEmployeeSchema = z
  .object({

    /* =====================================
       BASIC DETAILS
    ===================================== */

    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name exceeds maximum length"),

    personal_email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email format"),

    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),

    emergency_contact: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, "Invalid emergency contact number")
      .nullable()
      .optional(),

    /* =====================================
       ROLE / DEPARTMENT
    ===================================== */

    RoleID: z
      .number()
      .int()
      .positive("RoleID must be positive"),

    Department_id: z
      .number()
      .int()
      .positive("Department_id must be positive"),

    Dashboard_id: z
      .number()
      .int()
      .positive("Dashboard_id must be positive"),

    client_id: z
      .number()
      .int()
      .positive("client_id must be positive")
      .nullable()
      .optional(),

    manager_id: z
      .string()
      .trim()
      .min(1, "Manager ID cannot be empty")
      .nullable()
      .optional(),

    /* =====================================
       EMPLOYMENT DETAILS
    ===================================== */

    designation: z
      .string()
      .trim()
      .min(1, "Designation is required")
      .max(100, "Designation exceeds maximum length"),

    joining_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid joining_date format"),

    employment_type: z.enum(employmentTypes),

    work_mode: z.enum(workModes),

    employee_status: z.enum(employeeStatuses).default("ACTIVE"),

    /* =====================================
       PROFILE
    ===================================== */

    profile_image: z
      .string()
      .trim()
      .nullable()
      .optional(),                 // ← Also fixed: removed .min(1) since null is allowed

  })
  .superRefine((data, ctx) => {

    const parsedDate = new Date(data.joining_date);

    if (isNaN(parsedDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["joining_date"],
        message: "Invalid joining_date",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["joining_date"],
        message: "Joining date cannot be future date",
      });
    }

    if (data.emergency_contact && data.phone === data.emergency_contact) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergency_contact"],
        message: "Emergency contact cannot be same as phone",
      });
    }

    // Check if manager_id is provided and matches newEmpId (handled in controller instead)

  })
  .strict();

/* =====================================================
   TYPE EXPORT
===================================================== */

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;