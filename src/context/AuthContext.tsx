import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <>{children}</>;
};

export const useAuthContext = () => {
  return useAuth();
};