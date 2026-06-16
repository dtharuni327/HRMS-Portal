import { applyLeaveRepository }
from "../../repositories/leave/applyLeave.repository";
import { LEAVE_MESSAGES }
from "../../constants/leave.constants";
export const applyLeaveService =
async (data: any,user: any
) => {
  const result =
    await applyLeaveRepository(data,user);
  return {success: true,
    message: LEAVE_MESSAGES.LEAVE_APPLIED,
    data: result.recordset
  };
};