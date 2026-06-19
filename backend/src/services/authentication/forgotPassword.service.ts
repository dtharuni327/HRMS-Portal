import { forgotPasswordRepository } from "../../repositories/authentication/forgotPassword.repository";
import { generateOtp } from "../../utils/authentication/generateOtp";
import { sendMail } from "../../utils/authentication/sendMail";
export const forgotPasswordService = async (data: any) => {
    const { email } = data;
    const otp = generateOtp();
    await forgotPasswordRepository(email,otp);
    await sendMail(email,"Password Reset OTP",`Your OTP is ${otp}`);
        return {success: true,message: "OTP sent successfully"
  };
};