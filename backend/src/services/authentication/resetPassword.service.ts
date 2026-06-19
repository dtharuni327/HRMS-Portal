import bcrypt from "bcryptjs";
import {resetPasswordRepository} 
from "../../repositories/authentication/resetPassword.repository";
export const resetPasswordService =async (data: any) => {
    const {email,otp,password} = data;
    const hashedPassword =await bcrypt.hash(password,10);
    const result = await resetPasswordRepository(email,otp,
        hashedPassword);
        if (result.recordset[0]?.Status !== "SUCCESS") 
            {throw new Error(result.recordset[0]?.Message ||
                "Password reset failed");}
                return {success: true,message:"Password reset successfully"};
};
