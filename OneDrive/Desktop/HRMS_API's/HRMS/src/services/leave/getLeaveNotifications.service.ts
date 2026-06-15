import {getLeaveNotificationsRepository} 
from "../../repositories/leave/getLeaveNotifications.repository";
import {LEAVE_MESSAGES} from "../../constants/leave.constants";
export const getLeaveNotificationsService =
async (user: any) => {
  const result =await getLeaveNotificationsRepository(user);
  return {success: true,
    message:LEAVE_MESSAGES.NOTIFICATIONS_FETCHED,
    data:result.recordset
  };
};