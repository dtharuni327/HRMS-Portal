import {updateNotificationVisibilityRepository} 
from "../../repositories/leave/updateNotificationVisibility.repository";
import {LEAVE_MESSAGES} from "../../constants/leave.constants";
export const updateNotificationVisibilityService =
async (data: any,user: any) => {
  await updateNotificationVisibilityRepository(data,user);
  return {success: true,
    message:LEAVE_MESSAGES.NOTIFICATION_VISIBILITY_UPDATED
  };
};