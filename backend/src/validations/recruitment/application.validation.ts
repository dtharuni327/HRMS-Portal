import { z } from "zod";
import { APPLICATION_STATUS } from "../../constants/recruitment.constants";

const applicationStatusValues = Object.values(APPLICATION_STATUS) as [string, ...string[]];

export const updateApplicationStatusSchema = z
  .object({
    status: z.enum(applicationStatusValues as [string, ...string[]]),
    rejectionReason: z.string().trim().max(500).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.status === APPLICATION_STATUS.REJECTED && !data.rejectionReason) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rejectionReason"], message: "rejectionReason is required when status is Rejected" });
    }
  });

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

export const getApplicationsSchema = z
  .object({
    jobId:  z.coerce.number().int().positive().optional(),
    status: z.enum(applicationStatusValues as [string, ...string[]]).optional(),
    empId:  z.string().trim().min(1).optional(),
  })
  .strict();

export type GetApplicationsQuery = z.infer<typeof getApplicationsSchema>;
