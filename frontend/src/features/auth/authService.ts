import { useAuthStore } from "../../store/authStore";
import { hrmsApi } from "../../services/hrmsApi";

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  return hrmsApi.login({
    username: credentials.email.includes("@")
      ? credentials.email.split("@")[0]
      : credentials.email,
    password: credentials.password,
  });
};

export const loginAPI = login;

export const logout = async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  useAuthStore.getState().logout();
  return { success: true };
};

export const refreshToken = async () => {
  return { token: useAuthStore.getState().token };
};
