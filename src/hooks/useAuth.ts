import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Provide placeholders for fields previously expected from Redux
  const isLoading = false;
  const error = null as null | string;

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
  };
};