import jwt from "jsonwebtoken";
import {generateTokens} from "../../utils/authentication/generateTokens";
export const refreshTokenService =async (refreshToken: string) => {
    if (!refreshToken) {throw new Error("Refresh token is required");}
    const decoded: any =jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET!);
    const {accessToken,refreshToken: newRefreshToken} = 
    generateTokens({Emp_id:decoded.Emp_id,username:decoded.username,
        role:decoded.role});
        return {success: true,accessToken,refreshToken:newRefreshToken};
    };