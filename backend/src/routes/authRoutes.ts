import express from "express";
 
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendEmailVerificationOtp,
  verifyEmailOtp,
  refreshAccessToken
} from "../controllers/authController";
 
const router = express.Router();
 
/* =========================================
   REGISTER
========================================= */
 
router.post(
  "/register",
  register
);
 
/* =========================================
   LOGIN
========================================= */
 
router.post(
  "/login",
  login
);
 
/* =========================================
   FORGOT PASSWORD
========================================= */
 
router.put(
  "/forgot-password",
  forgotPassword
);
 
/* =========================================
   RESET PASSWORD
========================================= */
 
router.put(
  "/reset-password",
  resetPassword
);
 
/* =========================================
   SEND EMAIL OTP
========================================= */
 
router.post(
  "/email/send-otp",
  sendEmailVerificationOtp
);
 
/* =========================================
   VERIFY EMAIL OTP
========================================= */
 
router.put(
  "/email/verify",
  verifyEmailOtp
);
 
/* =========================================
   REFRESH TOKEN
========================================= */
 
router.post(
  "/refresh-token",
  refreshAccessToken
);
 
export default router;
 