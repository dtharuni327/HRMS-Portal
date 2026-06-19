import {updateLeaveStatusRepository} 
from "../../repositories/leave/updateLeaveStatus.repository";
import {LEAVE_MESSAGES} from "../../constants/leave.constants";
export const updateLeaveStatusService =
async (  data: any,user: any) => {
  await updateLeaveStatusRepository(data,user);
  return {success: true,
    message:LEAVE_MESSAGES.LEAVE_STATUS_UPDATED
  };
};