import { z } from "zod";
import { EMPLOYMENT_TYPE, JOB_STATUS } from "../../constants/recruitment.constants";

const employmentTypeValues = Object.values(EMPLOYMENT_TYPE) as [string, ...string[]];
const jobStatusValues = Object.values(JOB_STATUS) as [string, ...string[]];


export const createJobSchema = z
  .object({
    title: z
      .string().trim()
      .min(2, "Title is required")
      .max(150, "Title exceeds maximum length"),

    dept: z
      .string().trim()
      .min(1, "Department is required")
      .max(100, "Department exceeds maximum length"),

    status: z
      .enum(jobStatusValues as [string, ...string[]])
      .default(JOB_STATUS.OPEN),

    location: z
      .string().trim()
      .max(100, "Location exceeds maximum length")
      .default("India"),

    type: z
      .enum(employmentTypeValues as [string, ...string[]])
      .default(EMPLOYMENT_TYPE.FULL_TIME),

    experience: z
      .string().trim()
      .max(50, "Experience exceeds maximum length")
      .optional(),

    openings: z
      .number().int().positive("openings must be a positive number")
      .default(1),

    description: z
      .string().trim()
      .max(4000, "Description exceeds maximum length")
      .optional(),

    skills: z
      .array(z.string().trim().min(1).max(50))
      .max(20, "Maximum 20 skills allowed")
      .default([]),

    closingDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "closingDate must be YYYY-MM-DD")
      .optional(),
  })
  .strict();

export type CreateJobInput = z.infer<typeof createJobSchema>;
