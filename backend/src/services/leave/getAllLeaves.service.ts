import { getAllLeavesRepository }
from "../../repositories/leave/getAllLeaves.repository";
import { LEAVE_MESSAGES }
from "../../constants/leave.constants";
export const getAllLeavesService =
async (user: any) => {
  const result =
  await getAllLeavesRepository(user);
  return {
    success: true,
    message:
      LEAVE_MESSAGES.LEAVE_FETCHED,
    data:
      result.recordset
  };
};