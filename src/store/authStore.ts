import { create } from "zustand";
import type { User } from "../types/auth.types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token, user) => {
    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));