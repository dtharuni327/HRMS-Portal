import axios from "axios";
import { config } from "../config/env";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (axiosConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }

    return axiosConfig;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;