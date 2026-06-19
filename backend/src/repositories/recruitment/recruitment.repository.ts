import sql from "mssql";
import { db } from "../../config/db";
import { RECRUITMENT_SP } from "../../constants/recruitment.constants";
import { CreateJobInput } from "../../validations/recruitment/create.job.validation";
import { UpdateJobInput } from "../../validations/recruitment/update.job.validation";
import { ApplyToJobInput } from "../../validations/recruitment/apply.job.validation";
import { UpdateApplicationStatusInput, GetApplicationsQuery } from "../../validations/recruitment/application.validation";

// JOBS

export const getAllJobsRepo = async (params: {
  page: number; limit: number; search?: string; dept?: string; status?: string;
}) => {
  const { page, limit, search, dept, status } = params;
  const pool = await db;
  const req = new sql.Request(pool);
  req.input("page",   sql.Int,     page);
  req.input("limit",  sql.Int,     limit);
  req.input("search", sql.VarChar, search ?? null);
  req.input("dept",   sql.VarChar, dept   ?? null);
  req.input("status", sql.VarChar, status ?? null);
  return req.execute(RECRUITMENT_SP.GET_ALL_JOBS);
};

export const getJobByIdRepo = async (id: number) => {
  const pool = await db;
  const req = new sql.Request(pool);
  req.input("id", sql.Int, id);
  return req.execute(RECRUITMENT_SP.GET_JOB_BY_ID);
};

export const createJobRepo = async (data: CreateJobInput, postedByEmpId: string) => {
  const { title, dept, status, location, type, experience, openings, description, skills, closingDate } = data;
  const pool = await db;
  const req = new sql.Request(pool);
  req.input("title",        sql.VarChar,         title);
  req.input("dept",         sql.VarChar,         dept);
  req.input("status",       sql.VarChar,         status);
  req.input("location",     sql.VarChar,         location);
  req.input("type",         sql.VarChar,         type);
  req.input("experience",   sql.VarChar,         experience   ?? null);
  req.input("openings",     sql.Int,             openings);
  req.input("description",  sql.VarChar(sql.MAX), description ?? null);
  req.input("skills",       sql.VarChar(sql.MAX), JSON.stringify(skills ?? [])); // stored as JSON text
  req.input("closingDate",  sql.Date,            closingDate  ?? null);
  req.input("postedByEmpId", sql.VarChar(12),    postedByEmpId);
  return req.execute(RECRUITMENT_SP.CREATE_JOB);
};

export const updateJobRepo = async (id: number, data: UpdateJobInput) => {
  const { title, dept, status, location, type, experience, openings, description, skills, closingDate } = data;
  const pool = await db;
  const req = new sql.Request(pool);
  req.input("id",          sql.Int,              id);
  req.input("title",       sql.VarChar,          title        ?? null);
  req.input("dept",        sql.VarChar,          dept         ?? null);
  req.input("status",      sql.VarChar,          status       ?? null);
  req.input("location",    sql.VarChar,          location     ?? null);
  req.input("type",        sql.VarChar,          type         ?? null);
  req.input("experience",  sql.VarChar,          experience   ?? null);
  req.input("openings",    sql.Int,              openings     ?? null);
  req.input("description", sql.VarChar(sql.MAX), description  ?? null);
  req.input("skills",      sql.VarChar(sql.MAX), skills !== undefined ? JSON.stringify(skills) : null);
  req.input("closingDate", sql.Date,             closingDate  ?? null);
  return req.execute(RECRUITMENT_SP.UPDATE_JOB);
};

export const deleteJobRepo = async (id: number) => {
  const pool = await db;
  const req = new sql.Request(pool);
  req.input("id", sql.Int, id);
  return req.execute(RECRUITMENT_SP.DELETE_JOB);
};

//APPLICATIONS 

export const getApplicationsRepo = async (query: GetApplicationsQuery) => {
  const { jobId, status, empId } = query;
  const pool = await db;
  const req = new sql.Request(pool);
  req.input("jobId",  sql.Int,          jobId  ?? null);
  req.input("status", sql.VarChar,      status ?? null);
  req.input("empId",  sql.VarChar(12),  empId  ?? null);
  return req.execute(RECRUITMENT_SP.GET_APPLICATIONS);
};

export const applyToJobRepo = async (
  jobId: number,
  appliedByEmpId: string,
  data: ApplyToJobInput,
) => {
  const { applicationType, candidateName, candidateEmail, resumeFileName, resumeUrl } = data;
  const pool = await db;
  const req = new sql.Request(pool);
  req.input("jobId",           sql.Int,          jobId);
  req.input("appliedByEmpId",  sql.VarChar(12),  appliedByEmpId);
  req.input("applicationType", sql.VarChar,      applicationType);
  req.input("candidateName",   sql.VarChar,      candidateName);
  req.input("candidateEmail",  sql.VarChar,      candidateEmail);
  req.input("resumeFileName",  sql.VarChar,      resumeFileName);
  req.input("resumeUrl",       sql.VarChar,      resumeUrl ?? null);
  return req.execute(RECRUITMENT_SP.APPLY_TO_JOB);
};

export const updateApplicationStatusRepo = async (
  applicationId: number,
  data: UpdateApplicationStatusInput,
) => {
  const { status, rejectionReason } = data;
  const pool = await db;
  const req = new sql.Request(pool);
  req.input("applicationId",   sql.Int,     applicationId);
  req.input("status",          sql.VarChar, status);
  req.input("rejectionReason", sql.VarChar, rejectionReason ?? null);
  return req.execute(RECRUITMENT_SP.UPDATE_APPLICATION_STATUS);
};
