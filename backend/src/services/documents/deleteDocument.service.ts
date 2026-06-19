import { deleteDocumentRepo } from "../../repositories/documents/documents.repository";

interface DeleteOptions {
  id: number;
  requestedByEmpId: string;
  requestedByRole: string;
}

export const deleteDocumentService = async (options: DeleteOptions) => {
  await deleteDocumentRepo(options); // SP throws ACCESS_DENIED / NOT_FOUND via RAISERROR
  return { deleted: true };
};
