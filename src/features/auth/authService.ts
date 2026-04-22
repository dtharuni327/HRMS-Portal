import axios from "axios";
import usersData from "../../data/users.json";

/* =========================
   🌐 API BASE (Vite fix)
========================= */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/* =========================
   🔐 FAKE LOGIN (JSON MODE)
========================= */
export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const user = usersData.users.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.username,
        role: user.role,
        name: user.name,
        dashboard: user.dashboard,
      },
      token: "fake-jwt-token",
    };
  } catch (error) {
    throw error;
  }
};

/* =========================
   🚀 REAL API LOGIN (backend ready)
========================= */
export const loginAPI = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* =========================
   🚪 LOGOUT
========================= */
export const logout = async () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    const response = await axios.post(`${API_BASE_URL}/auth/logout`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

/* =========================
   🔄 REFRESH TOKEN
========================= */
export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`);
    return response.data;
  } catch (error) {
    throw error;
  }
};