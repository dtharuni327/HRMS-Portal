import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <>{children}</>;
};

export const useAuthContext = () => {
  return useAuthStore();
};