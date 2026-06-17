import { z } from "zod";
import { DOCUMENT_STATUS, DOCUMENT_TYPE } from "../../constants/documents.constants";

const documentStatusValues = Object.values(DOCUMENT_STATUS) as [string, ...string[]];
const documentTypeValues   = Object.values(DOCUMENT_TYPE)   as [string, ...string[]];


export const getDocumentsSchema = z
  .object({
    empId:  z.string().trim().regex(/^CFT\d{8}$/, "Invalid Employee ID format").optional(),
    status: z.enum(documentStatusValues as [string, ...string[]]).optional(),
    type:   z.enum(documentTypeValues   as [string, ...string[]]).optional(),
    search: z.string().trim().min(1).max(100).optional(),
  })
  .strict();

export type GetDocumentsQuery = z.infer<typeof getDocumentsSchema>;

export const getDocumentByIdSchema = z.object({
  id: z.coerce.number().int().positive("Document ID is required"),
});

export type GetDocumentByIdParams = z.infer<typeof getDocumentByIdSchema>;
