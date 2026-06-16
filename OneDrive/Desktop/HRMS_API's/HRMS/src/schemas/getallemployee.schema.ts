import { z } from "zod";

/* =====================================================
   EMPLOYEE STATUS ENUM
===================================================== */

const employeeStatuses = [
  "ACTIVE",
  "INACTIVE",
  "RESIGNED",
  "TERMINATED",
  "ON_NOTICE",
] as const;

/* =====================================================
   GET ALL EMPLOYEES QUERY SCHEMA
===================================================== */

export const employeeQuerySchema =
  z.object({

    /* ================= PAGINATION ================= */

    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10),

    /* ================= SEARCH ================= */

    search: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    /* ================= FILTERS ================= */

    department: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    role: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    // Transform to uppercase first, then validate against enum
    // This makes "active", "Active", "ACTIVE" all valid
    status: z
      .string()
      .trim()
      .toUpperCase()
      .pipe(z.enum(employeeStatuses))
      .optional(),

  })

  /* ================= STRICT MODE ================= */

  .strict();

/* =====================================================
   TYPESCRIPT TYPE
===================================================== */

export type EmployeeQueryInput =
  z.infer<typeof employeeQuerySchema>;