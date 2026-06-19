import { useAuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const auth = useAuthContext();

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: false,
    error: null,
  };
};
