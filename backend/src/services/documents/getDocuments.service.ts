import { getDocumentsByEmployeeRepo } from "../../repositories/documents/documents.repository";
import { GetDocumentsQuery } from "../../validations/documents/get.document.validation";

export const getDocumentsService = async (query: GetDocumentsQuery) => {
  const result = await getDocumentsByEmployeeRepo(query);
  return result.recordset;
};
