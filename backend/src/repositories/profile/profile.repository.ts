import sql from "mssql";
import { db } from "../../config/db";
import { UpdateProfileInput } from "../../validations/profile/update.profile.validation";


export const getMyProfileRepo = async (empId: string) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("empId", sql.VarChar(20), empId);

  return request.execute("sp_GetMyProfile");
};

interface UpdateProfileParams extends UpdateProfileInput {
  empId: string;
}

export const updateMyProfileRepo = async (params: UpdateProfileParams) => {
  const {
    empId,
    personal_email,
    phone,
    emergency_contact,
    profile_image,
    address,
    work_mode,
  } = params;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("empId",             sql.VarChar(20),  empId);
  request.input("personal_email",    sql.VarChar(100), personal_email    ?? null);
  request.input("phone",             sql.VarChar(10),  phone             ?? null);
  request.input("emergency_contact", sql.VarChar(10),  emergency_contact ?? null);
  request.input("profile_image",     sql.VarChar(255), profile_image     ?? null);
  request.input("address",           sql.VarChar(255), address           ?? null);
  request.input("work_mode",         sql.VarChar(20),  work_mode         ?? null);

  return request.execute("sp_UpdateMyProfile");
};


export const getPasswordHashRepo = async (empId: string) => {
  const pool = await db;
  return pool
    .request()
    .input("empId", sql.VarChar(20), empId)
    .query(`
      SELECT password, Emp_id
      FROM   authentication
      WHERE  Emp_id = @empId
    `);
};


export const changePasswordRepo = async (
  empId: string,
  newPasswordHash: string
) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("empId",           sql.VarChar(20),  empId);
  request.input("newPasswordHash", sql.VarChar(255), newPasswordHash);

  return request.execute("sp_ChangeEmployeePassword");
};