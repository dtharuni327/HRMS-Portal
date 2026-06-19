import { Router } from "express";
import {register} from "../controllers/authentication/register.controller";
import {login} from "../controllers/authentication/login.controller";
import {forgotPassword} from "../controllers/authentication/forgotPassword.controller";
import {resetPassword} from "../controllers/authentication/resetPassword.controller";
import {sendEmailVerification} from "../controllers/authentication/sendEmailVerification.controller";
import {verifyEmail} from "../controllers/authentication/verifyEmail.controller";
import {refreshToken} from "../controllers/authentication/refreshToken.controller";
import {registerValidation} from "../validations/authentication/register.validation";
import {loginValidation} from "../validations/authentication/login.validation";
import {forgotPasswordValidation} from "../validations/authentication/forgotPassword.validation";
import {resetPasswordValidation} from "../validations/authentication/resetPassword.validation";
import {sendEmailVerificationValidation} from "../validations/authentication/sendEmailVerification.validation";
import {verifyEmailValidation} from "../validations/authentication/verifyEmail.validation";
import {refreshTokenValidation} from "../validations/authentication/refreshToken.validation";
import {validate} from "../middleware/validation.middleware";
const router = Router();
router.post("/register",registerValidation,validate,register);
router.post("/login",loginValidation,validate,login);
router.post("/forgot-password",forgotPasswordValidation,validate,
  forgotPassword);
router.post("/reset-password",resetPasswordValidation,validate,
  resetPassword);
router.post("/send-email-verification",sendEmailVerificationValidation,
  validate,sendEmailVerification);
router.post("/verify-email",verifyEmailValidation,validate,
  verifyEmail);
router.post("/refresh-token",refreshTokenValidation,validate,refreshToken);
export default router;