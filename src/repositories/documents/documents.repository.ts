import sql from "mssql";
import { db } from "../../config/db";
import { DOCUMENT_SP } from "../../constants/documents.constants";
import { UploadDocumentInput } from "../../validations/documents/upload.document.validation";
import { GetDocumentsQuery } from "../../validations/documents/get.document.validation";
import { UpdateDocumentStatusInput } from "../../validations/documents/updateStatus.document.validation";

// UPLOAD
interface UploadParams extends UploadDocumentInput {
  empId: string;       
  uploadedByEmpId: string; 
}

export const uploadDocumentRepo = async (params: UploadParams) => {
  const { empId, uploadedByEmpId, name, type, fileName, fileUrl } = params;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("empId",           sql.VarChar(12), empId);
  request.input("uploadedByEmpId", sql.VarChar(12), uploadedByEmpId);
  request.input("name",            sql.VarChar,     name);
  request.input("type",            sql.VarChar,     type);
  request.input("fileName",        sql.VarChar,     fileName);
  request.input("fileUrl",         sql.VarChar,     fileUrl ?? null);

  return request.execute(DOCUMENT_SP.UPLOAD);
};

// GET BY EMPLOYEE (with optional filters — used by both HR and employee views)
export const getDocumentsByEmployeeRepo = async (query: GetDocumentsQuery) => {
  const { empId, status, type, search } = query;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("empId",  sql.VarChar(12), empId  ?? null);
  request.input("status", sql.VarChar,     status ?? null);
  request.input("type",   sql.VarChar,     type   ?? null);
  request.input("search", sql.VarChar,     search ?? null);

  return request.execute(DOCUMENT_SP.GET_BY_EMPLOYEE);
};

// GET SINGLE DOCUMENT
export const getDocumentByIdRepo = async (id: number) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("id", sql.Int, id);

  return request.execute(DOCUMENT_SP.GET_BY_ID);
};

// UPDATE STATUS (HR / Manager approves or rejects)
interface UpdateStatusParams extends UpdateDocumentStatusInput {
  id: number;
  reviewedByEmpId: string;
}

export const updateDocumentStatusRepo = async (params: UpdateStatusParams) => {
  const { id, status, rejectionReason, reviewedByEmpId } = params;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("id",              sql.Int,          id);
  request.input("status",          sql.VarChar,      status);
  request.input("rejectionReason", sql.VarChar,      rejectionReason ?? null);
  request.input("reviewedByEmpId", sql.VarChar(12),  reviewedByEmpId);

  return request.execute(DOCUMENT_SP.UPDATE_STATUS);
};

// DELETE
interface DeleteParams {
  id: number;
  requestedByEmpId: string; // SP checks ownership or admin role
  requestedByRole: string;
}

export const deleteDocumentRepo = async (params: DeleteParams) => {
  const { id, requestedByEmpId, requestedByRole } = params;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("id",                sql.Int,          id);
  request.input("requestedByEmpId",  sql.VarChar(12),  requestedByEmpId);
  request.input("requestedByRole",   sql.VarChar,      requestedByRole);

  return request.execute(DOCUMENT_SP.DELETE);
};
