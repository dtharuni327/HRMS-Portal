import bcrypt from "bcryptjs";
import {loginRepository} from "../../repositories/authentication/login.repository";
import {generateTokens} from "../../utils/authentication/generateTokens";
export const loginService = async (data: any) => {
 const {username,password} = data;
  const result =await loginRepository(username);
  if (result.recordset.length === 0) {
    throw new Error("User not found");}
const user =result.recordset[0];
const isPasswordValid =await bcrypt.compare(password,user.password);
if (!isPasswordValid) {throw new Error("Invalid password");}
const {accessToken,refreshToken} = generateTokens({Emp_id:user.Emp_id,
username:user.username,role:user.role_name});
return {success: true,message:"Login successful",accessToken,refreshToken,
    user: {Emp_id:user.Emp_id,username:user.username,name:user.Name,
        email:user.company_email,role:user.role_name
    }
};
};
