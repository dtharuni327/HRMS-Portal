export const AUTH_MESSAGES = {
  REGISTER_SUCCESS:
    "User registered successfully",

  LOGIN_SUCCESS:
    "Login successful",

  LOGOUT_SUCCESS:
    "Logout successful",

  EMAIL_VERIFICATION_SENT:
    "Verification email sent successfully",

  EMAIL_VERIFIED:
    "Email verified successfully",

  OTP_SENT:
    "OTP sent successfully",

  PASSWORD_RESET_SUCCESS:
    "Password reset successfully",

  REFRESH_TOKEN_GENERATED:
    "Access token generated successfully",

  USER_NOT_FOUND:
    "User not found",

  INVALID_CREDENTIALS:
    "Invalid credentials",

  INVALID_TOKEN:
    "Invalid token",

  TOKEN_EXPIRED:
    "Token expired",

  EMAIL_ALREADY_EXISTS:
    "Email already exists",

  EMAIL_REQUIRED:
    "Email is required",

  PASSWORD_REQUIRED:
    "Password is required",

  OTP_REQUIRED:
    "OTP is required",

  UNAUTHORIZED:
    "Unauthorized access",

  INTERNAL_SERVER_ERROR:
    "Internal server error"
};

export const AUTH_API = {
  REGISTER: "/register",
  LOGIN: "/login",
  REFRESH_TOKEN: "/refresh-token",
  SEND_EMAIL_VERIFICATION:
    "/send-email-verification",
  VERIFY_EMAIL:
    "/verify-email",
  FORGOT_PASSWORD:
    "/forgot-password",
  RESET_PASSWORD:
    "/reset-password",
  LOGOUT:
    "/logout"
};

export const TOKEN_TYPES = {
  ACCESS_TOKEN:
    "ACCESS_TOKEN",

  REFRESH_TOKEN:
    "REFRESH_TOKEN"
};