import { z } from "zod";
export const updateProjectEffortSchema = z.object({
  ProjectName: z
    .string()
    .min(1, "Project name is required")
    .max(200, "Project name cannot exceed 200 characters"),

  WorkDate: z
    .string()
    .min(1, "Work date is required"),

  HoursWorked: z
    .number()
    .min(0, "Hours worked cannot be negative")
    .max(24, "Hours worked cannot exceed 24"),

  TaskDescription: z
    .string()
    .max(1000, "Task description cannot exceed 1000 characters")
    .optional()
    .nullable(),
});

export type UpdateProjectEffortInput = z.infer<
  typeof updateProjectEffortSchema
>;