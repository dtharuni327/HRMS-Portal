import { uploadDocumentRepo } from "../../repositories/documents/documents.repository";
import { UploadDocumentInput } from "../../validations/documents/upload.document.validation";

interface UploadOptions extends UploadDocumentInput {
  empId: string;
  uploadedByEmpId: string;
}

export const uploadDocumentService = async (options: UploadOptions) => {
  const result = await uploadDocumentRepo(options);
  return result.recordset[0]; // SP returns the newly created document row
};
