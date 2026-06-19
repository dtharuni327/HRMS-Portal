import sql from "mssql";
import { db } from "../../config/db";
import { TEAM_DIRECTORY_SP } from "../../constants/teamDirectory.constants";
import { GetTeamDirectoryQuery } from "../../validations/teamdirectory/getTeamDirectory.validation";

// GET TEAM DIRECTORY

interface GetTeamParams extends GetTeamDirectoryQuery {
  loggedInEmpId: string;
  loggedInRole:  string;
}

export const getTeamDirectoryRepo = async (params: GetTeamParams) => {
  const { loggedInEmpId, loggedInRole, dept, search } = params;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("loggedInEmpId", sql.VarChar(12), loggedInEmpId);
  request.input("loggedInRole",  sql.VarChar,     loggedInRole);
  request.input("dept",          sql.VarChar,     dept   ?? null);
  request.input("search",        sql.VarChar,     search ?? null);

  return request.execute(TEAM_DIRECTORY_SP.GET_TEAM);
};

// GET SINGLE TEAM MEMBER DETAIL

interface GetMemberParams {
  empId:         string; 
  loggedInEmpId: string;
  loggedInRole:  string;
}

export const getTeamMemberDetailRepo = async (params: GetMemberParams) => {
  const { empId, loggedInEmpId, loggedInRole } = params;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("empId",         sql.VarChar(12), empId);
  request.input("loggedInEmpId", sql.VarChar(12), loggedInEmpId);
  request.input("loggedInRole",  sql.VarChar,     loggedInRole);

  return request.execute(TEAM_DIRECTORY_SP.GET_MEMBER_DETAIL);
};
