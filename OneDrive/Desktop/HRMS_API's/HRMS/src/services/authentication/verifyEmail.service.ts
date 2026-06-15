import {verifyEmailRepository} 
from "../../repositories/authentication/verifyEmail.repository";
export const verifyEmailService =async (data: any) => {
    const {email,otp} = data;
    const result =await verifyEmailRepository(email,otp);
    if (result.recordset[0]?.Status!== "SUCCESS") {
        throw new Error(result.recordset[0]?.Message);}
        return {success: true,message:"Email verified successfully"
        };
};