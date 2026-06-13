import { PunchOutInput } from "../../repositories/attendance/punchOut.repository";
import { punchOutRepository } from "../../repositories/attendance/punchOut.repository";

export const punchOutService = async (data: PunchOutInput) => {
  try {
    const result = await punchOutRepository(data);
    return {
      success: true,
      data: result,
      message: "Punch-out successful"
    };
  } catch (error: any) {
    const msg = error.message;
    
    if (msg?.includes("No punch-in record found for today")) {
      throw { status: 400, message: "No punch-in record found for today" };
    }
    if (msg?.includes("Already punched out today")) {
      throw { status: 400, message: "Already punched out today" };
    }
    
    throw { status: 500, message: "Server error" };
  }
};