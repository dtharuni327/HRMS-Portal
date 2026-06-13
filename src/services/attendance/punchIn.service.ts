import { PunchInInput } from "../../repositories/attendance/punchIn.repository";
import { punchInRepository } from "../../repositories/attendance/punchIn.repository";

export const punchInService = async (data: PunchInInput) => {
  try {
    const result = await punchInRepository(data);
    return {
      success: true,
      data: result,
      message: "Punch-in successful"
    };
  } catch (error: any) {
    const msg = error.message;
    
    if (msg?.includes("Already punched in today")) {
      throw { status: 400, message: "Already punched in today" };
    }
    if (msg?.includes("Employee not found")) {
      throw { status: 404, message: "Employee not found" };
    }
    if (msg?.includes("Punch-in not allowed before 8:30 AM")) {
      throw { status: 400, message: "Punch-in not allowed before 8:30 AM" };
    }
    if (msg?.includes("Punch-in not allowed after 5:50 PM")) {
      throw { status: 400, message: "Punch-in not allowed after 5:50 PM" };
    }
    if (msg?.includes("Location required for office punch-in")) {
      throw { status: 400, message: "Location required for office punch-in" };
    }
    if (msg?.includes("You are not in office location")) {
      throw { status: 403, message: "You are not in office location" };
    }
    
    throw { status: 500, message: "Server error" };
  }
};