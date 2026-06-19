import sql from "mssql";
import { db } from "../../config/db";
import jwt from "jsonwebtoken";

export const loginService = async (data: any) => {
  const { username, password } = data;

  const pool = await db;

  const result = await pool
    .request()
    .input("username", sql.VarChar, username)
    .input("password", sql.VarChar, password)
    .query(`
      SELECT *
      FROM Employees
      WHERE Username = @username
      AND Password = @password
    `);

  if (result.recordset.length === 0) {
    throw new Error("Invalid username or password");
  }

  const user = result.recordset[0];

  const token = jwt.sign(
    {
      empId: user.Emp_id,
      username: user.Username
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d"
    }
  );

  return {
    success: true,
    message: "Login successful",
    token,
    user
  };
};