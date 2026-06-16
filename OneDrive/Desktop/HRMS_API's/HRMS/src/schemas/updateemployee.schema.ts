import { z } from "zod";

/* =====================================================
   ENUMS — must match createemployee_schema.ts exactly
   Issue #1 — PART_TIME removed (not in DB CHECK)
===================================================== */

const employmentTypes = ["FULL_TIME", "CONTRACT", "INTERN"] as const;
const workModes       = ["WFO", "WFH", "HYBRID"] as const;
const employeeStatuses = [
  "ACTIVE", "INACTIVE", "RESIGNED", "TERMINATED", "ON_NOTICE",
] as const;

/* =====================================================
   UPDATE EMPLOYEE SCHEMA
   Issue #1  — all fields lowercase/snake_case
               DB column mapping (Name→name, Phone→phone,
               RoleID→role_id, Department_id→department_id)
               happens in the controller SET clause.
   Issue #12 — profile_image URL validation
===================================================== */

export const updateEmployeeSchema = z
  .object({

    /* ---- BASIC DETAILS ---- */

    name: z
      .string().trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),

    personal_email: z
      .string().trim().toLowerCase()
      .email("Invalid email format")
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val),
        "Email domain must have a valid TLD"
      )
      .optional(),

    phone: z
      .string().trim()
      .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
      .optional(),

    designation: z
      .string().trim()
      .min(2, "Designation must be at least 2 characters")
      .max(100, "Designation cannot exceed 100 characters")
      .optional(),

    /* ---- EMPLOYMENT DETAILS ---- */

    employment_type: z.enum(employmentTypes).optional(),
    work_mode:       z.enum(workModes).optional(),
    employee_status: z.enum(employeeStatuses).optional(),

    /* ---- CONTACT ---- */

    emergency_contact: z
      .string().trim()
      .regex(/^[0-9]{10}$/, "Emergency contact must be 10 digits")
      .optional(),

    /* ---- RELATIONSHIP / MAPPING ---- */

    manager_id: z
      .string().trim()
      .min(1, "Manager ID cannot be empty")
      .optional(),

    department_id: z
      .number().int("Department ID must be an integer")
      .positive("Department ID must be positive")
      .optional(),

    client_id: z
      .number().int("Client ID must be an integer")
      .positive("Client ID must be positive")
      .optional(),

    role_id: z
      .number().int("Role ID must be an integer")
      .positive("Role ID must be positive")
      .optional(),

    /* ---- PROFILE ---- */

    profile_image: z
      .string().trim()
      .url("profile_image must be a valid URL")  // Issue #12
      .optional(),

  })
  .strict();

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;