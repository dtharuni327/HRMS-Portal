import { z } from "zod";
import { EMPLOYMENT_TYPE, JOB_STATUS } from "../../constants/recruitment.constants";

const employmentTypeValues = Object.values(EMPLOYMENT_TYPE) as [string, ...string[]];
const jobStatusValues = Object.values(JOB_STATUS) as [string, ...string[]];

export const updateJobSchema = z // all fields optional; only provided fields are updated
  .object({
    title: z.string().trim().min(2).max(150).optional(),
    dept: z.string().trim().min(1).max(100).optional(),
    status: z.enum(jobStatusValues as [string, ...string[]]).optional(),
    location: z.string().trim().max(100).optional(),
    type: z.enum(employmentTypeValues as [string, ...string[]]).optional(),
    experience: z.string().trim().max(50).optional(),
    openings: z.number().int().positive("openings must be a positive number").optional(),
    description: z.string().trim().max(4000).optional(),
    skills: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
    closingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "closingDate must be YYYY-MM-DD").optional(),
  })
  .strict();

export type UpdateJobInput = z.infer<typeof updateJobSchema>;
