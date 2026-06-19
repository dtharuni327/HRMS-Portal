import { getDocumentByIdRepo } from "../../repositories/documents/documents.repository";

export const getDocumentByIdService = async (id: number) => {
  const result = await getDocumentByIdRepo(id);
  return result.recordset[0] ?? null; // null → 404
};
