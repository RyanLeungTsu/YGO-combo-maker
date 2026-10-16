import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  userEmail: string | null;
  setAuth: (token: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      userEmail: null,
      setAuth: (token, email) => set({ token, userEmail: email }),
      logout: () => set({ token: null, userEmail: null }),
    }),
    { name: "ygo-auth-storage" }
  )
);