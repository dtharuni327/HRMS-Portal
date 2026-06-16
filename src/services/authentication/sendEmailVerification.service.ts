import {sendEmailVerificationRepository} 
from "../../repositories/authentication/sendMailVerification.repository";
import {generateOtp} from "../../utils/authentication/generateOtp";
import {sendMail} from "../../utils/authentication/sendMail";
export const sendEmailVerificationService =async (data: any) => {
    const { email } = data;
    const otp =generateOtp();
    await sendEmailVerificationRepository(email,otp);
    await sendMail(email,"Email Verification",
        `Your verification OTP is ${otp}`);
        return {success: true,message:"Verification OTP sent successfully"
        };
};