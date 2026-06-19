import { updateDocumentStatusRepo } from "../../repositories/documents/documents.repository";
import { UpdateDocumentStatusInput } from "../../validations/documents/updateStatus.document.validation";

interface UpdateOptions extends UpdateDocumentStatusInput {
  id: number;
  reviewedByEmpId: string;
}

export const updateDocumentStatusService = async (options: UpdateOptions) => {
  const result = await updateDocumentStatusRepo(options);
  return result.recordset[0]; // SP returns the updated document row
};
