import sql from "mssql";
import { db } from "../../config/db";
export const registerRepository =
async (data: any) => {
  const pool =await db;
  return await pool
    .request()
    .input("Name",sql.VarChar,data.name)
    .input("Email",sql.VarChar,data.email)
    .input("Password",sql.VarChar,data.password)
    .input("Emp_id",sql.VarChar,data.Emp_id)
    .input(
      "Phone",
      sql.VarChar,
      data.phone
    )
    .input(
      "ClientId",
      sql.Int,
      data.client_id
    )
    .execute(
      "SP_Register"
    );
};