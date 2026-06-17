import { z } from "zod";
import { DOCUMENT_STATUS } from "../../constants/documents.constants";

const documentStatusValues = Object.values(DOCUMENT_STATUS) as [string, ...string[]];

// HR / Manager reviews uploaded documents and sets status to Approved/Rejected
export const updateDocumentStatusSchema = z
  .object({
    status: z.enum(documentStatusValues as [string, ...string[]]),
    rejectionReason: z
      .string().trim().max(500, "Rejection reason exceeds maximum length")
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.status === DOCUMENT_STATUS.REJECTED && !data.rejectionReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rejectionReason"],
        message: "rejectionReason is required when status is Rejected",
      });
    }
  });

export type UpdateDocumentStatusInput = z.infer<typeof updateDocumentStatusSchema>;
