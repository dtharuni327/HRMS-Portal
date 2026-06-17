import { z } from "zod";
import { JOB_STATUS, PAGINATION } from "../../constants/recruitment.constants";

const jobStatusValues = Object.values(JOB_STATUS) as [string, ...string[]];

export const getJobByIdSchema = z.object({
  id: z.coerce.number().int().positive("Job id is required"),
});

export type GetJobByIdParams = z.infer<typeof getJobByIdSchema>;


export const getAllJobsSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),

    limit: z.coerce
      .number().int().min(1)
      .max(PAGINATION.MAX_LIMIT)
      .default(PAGINATION.DEFAULT_LIMIT),

    search: z.string().trim().min(1).max(100).optional(),
    dept: z.string().trim().min(1).max(100).optional(),

    status: z
      .string().trim() // "Open" | "Urgent" | "Closing Soon" | "Closed"
      .pipe(z.enum(jobStatusValues as [string, ...string[]]))
      .optional(),
  })
  .strict();

export type GetAllJobsQuery = z.infer<typeof getAllJobsSchema>;
