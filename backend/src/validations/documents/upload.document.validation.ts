import { z } from "zod";
import { DOCUMENT_TYPE } from "../../constants/documents.constants";

const documentTypeValues = Object.values(DOCUMENT_TYPE) as [string, ...string[]];


export const uploadDocumentSchema = z
  .object({
    name: z
      .string().trim()
      .min(1, "Document name is required")
      .max(150, "Document name exceeds maximum length"),

    type: z
      .enum(documentTypeValues as [string, ...string[]]),

    fileName: z
      .string().trim()
      .min(1, "File name is required")
      .max(255, "File name exceeds maximum length"),

    fileUrl: z
      .string().trim().url("fileUrl must be a valid URL")
      .optional(),

    // HR uploading on behalf of an employee passes empId in body.
    // Self-upload (employee) gets empId from JWT — not accepted from body.
    empId: z
      .string().trim()
      .regex(/^CFT\d{8}$/, "Invalid Employee ID format")
      .optional(),
  })
  .strict();

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
