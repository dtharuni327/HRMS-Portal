import { z } from "zod";
import { APPLICATION_TYPE } from "../../constants/recruitment.constants";

const applicationTypeValues = Object.values(APPLICATION_TYPE) as [string, ...string[]];

export const applyToJobSchema = z
  .object({
    applicationType: z
      .enum(applicationTypeValues as [string, ...string[]])
      .default(APPLICATION_TYPE.SELF),
    candidateName:  z.string().trim().min(2, "Candidate name is required").max(100),
    candidateEmail: z.string().trim().toLowerCase().email("Invalid email format"),
    resumeFileName: z.string().trim().min(1, "Resume file name is required").max(255),
    resumeUrl:      z.string().trim().url("resumeUrl must be a valid URL").optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.applicationType === APPLICATION_TYPE.REFERRAL) {
      if (!data.candidateName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["candidateName"], message: "Referral candidate name is required" });
      }
      if (!data.candidateEmail) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["candidateEmail"], message: "Referral candidate email is required" });
      }
    }
  });

export type ApplyToJobInput = z.infer<typeof applyToJobSchema>;
