import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "voter" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
  studentId?: string;
  department?: string;
  faculty?: string;
  level?: string;
  phone?: string;
  avatar?: string;
  twoFAEnabled?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  login: (u: AuthUser) => void;
  logout: () => void;
  update: (patch: Partial<AuthUser>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (u) => set({ user: u }),
      logout: () => set({ user: null }),
      update: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
    }),
    { name: "securevote-auth" },
  ),
);

interface ThemeState {
  theme: "light" | "dark";
  toggle: () => void;
  set: (t: "light" | "dark") => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggle: () =>
        set((s) => {
          const next = s.theme === "light" ? "dark" : "light";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next === "dark");
          }
          return { theme: next };
        }),
      set: (t) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", t === "dark");
        }
        set({ theme: t });
      },
    }),
    { name: "securevote-theme" },
  ),
);
