import { z } from "zod";

export const createProjectEffortSchema = z.object({
  Emp_id: z
    .string()
    .min(1, "Employee Id is required"),

  ProjectName: z
    .string()
    .min(1, "Project name is required")
    .max(200, "Project name cannot exceed 200 characters"),
    
  WorkDate: z
    .string()
    .min(1, "Work date is required"),

  HoursWorked: z.coerce
    .number()
    .min(0, "Hours worked cannot be negative")
    .max(24, "Hours worked cannot exceed 24"),

  TaskDescription: z
    .string()
    .max(1000, "Task description cannot exceed 1000 characters")
    .optional()
    .nullable(),
});

export type CreateProjectEffortInput = z.infer<
  typeof createProjectEffortSchema
>;