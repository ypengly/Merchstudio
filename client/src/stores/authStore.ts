import { create } from "zustand";
import { api } from "@/services/api";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  init: async () => {
    const tokens = api.getTokens();
    if (!tokens) {
      set({ isInitialized: true });
      return;
    }
    try {
      const user = await api.get<AuthUser>("/auth/me");
      set({ user, isInitialized: true });
    } catch {
      api.setTokens(null);
      set({ user: null, isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await api.post<{ user: AuthUser; accessToken: string; refreshToken: string }>("/auth/login", {
        email,
        password,
      });
      api.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      set({ user: data.user });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true });
    try {
      const data = await api.post<{ user: AuthUser; accessToken: string; refreshToken: string }>("/auth/register", {
        email,
        password,
        name,
      });
      api.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      set({ user: data.user });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    api.setTokens(null);
    set({ user: null });
  },
}));
