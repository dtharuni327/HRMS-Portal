import bcrypt from "bcryptjs";
import {
  getPasswordHashRepo,
  changePasswordRepo,
} from "../../repositories/profile/profile.repository";
import { ChangePasswordInput } from "../../validations/profile/changePassword.validation";
import { PROFILE_SP_ERROR } from "../../constants/profile.constants";

interface ChangePasswordOptions extends ChangePasswordInput {
  empId: string;
}

export const changePasswordService = async (options: ChangePasswordOptions) => {
  const { empId, currentPassword, newPassword } = options;

  // 1. Fetch the stored bcrypt hash from Employee.password_hash
  const result = await getPasswordHashRepo(empId);
  const row = result.recordset[0];

  if (!row) {
    const err: any = new Error("Employee not found");
    err.number = PROFILE_SP_ERROR.NOT_FOUND;
    throw err;
  }

  // 2. Compare the supplied current password against the stored hash
  const isMatch = await bcrypt.compare(currentPassword, row.password);

  if (!isMatch) {
    const err: any = new Error("Current password is incorrect");
    err.number = PROFILE_SP_ERROR.INVALID_PASSWORD;
    throw err;
  }

  // 3. Hash the new password and persist via sp_ChangeEmployeePassword
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await changePasswordRepo(empId, newPasswordHash);

  return { changed: true };
};