import { create } from "zustand";
import { apiClient } from "@/api/client";
import { syncSocketUser } from "@/lib/socket";
import { useWalletStore } from "./wallet.store";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "patient" | "doctor" | "admin";
  avatarUrl?: string;
  subtitle?: string;
}

export const DEMO_PATIENT_1: AuthUser = {
  id: "a1000000-0000-0000-0000-000000000001",
  name: "Rahul Sharma",
  phone: "+91 94120 54321",
  email: "patient_1@rehmatcare.com",
  role: "patient",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  subtitle: "patient_1@rehmatcare.com • Malviya Nagar",
};

export const DEMO_PATIENT_2: AuthUser = {
  id: "a2000000-0000-0000-0000-000000000002",
  name: "Priya Verma",
  phone: "+91 94120 54322",
  email: "patient_2@rehmatcare.com",
  role: "patient",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
  subtitle: "patient_2@rehmatcare.com • Civil Lines",
};

export const DEMO_PATIENT = DEMO_PATIENT_1;

export const DEMO_DOCTOR: AuthUser = {
  id: "b1000000-0000-0000-0000-000000000001",
  name: "Dr. Raees Akhtar",
  phone: "+91 98370 12345",
  email: "dr.raees@rehmathealthcare.com",
  role: "doctor",
  avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
  subtitle: "MBBS, MD - General Physician (₹15/min)",
};

export interface RegisterPayload {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role?: "patient" | "doctor";
}

interface AuthState {
  currentUser: AuthUser;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Modal controls
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;

  // Actions
  login: (identifier: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  quickLogin: (userId: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  switchRole: (role: "patient" | "doctor") => void;
  toggleRole: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: DEMO_PATIENT_1,
  token: typeof window !== "undefined" ? localStorage.getItem("rehmat_auth_token") : null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,

  isAuthModalOpen: false,
  authModalTab: "login",

  openAuthModal: (tab = "login") => set({ isAuthModalOpen: true, authModalTab: tab, error: null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, error: null }),

  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post<{
        token: string;
        user: AuthUser;
        walletBalance?: number;
      }>("/auth/login", { identifier, password });

      if (typeof window !== "undefined") {
        localStorage.setItem("rehmat_auth_token", data.token);
      }

      set({
        currentUser: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
      });

      syncSocketUser(data.user.id);

      if (data.walletBalance !== undefined) {
        useWalletStore.getState().setCachedBalance(data.walletBalance);
      }
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to log in. Please check your credentials.",
      });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post<{
        token: string;
        user: AuthUser;
        wallet?: { balance: number };
      }>("/auth/register", payload);

      if (typeof window !== "undefined") {
        localStorage.setItem("rehmat_auth_token", data.token);
      }

      set({
        currentUser: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
      });

      syncSocketUser(data.user.id);

      if (data.wallet?.balance !== undefined) {
        useWalletStore.getState().setCachedBalance(data.wallet.balance);
      }
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Registration failed. Phone or email may already be in use.",
      });
      throw err;
    }
  },

  quickLogin: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post<{
        token: string;
        user: AuthUser;
        walletBalance?: number;
      }>("/auth/quick-login", { userId });

      if (typeof window !== "undefined") {
        localStorage.setItem("rehmat_auth_token", data.token);
      }

      set({
        currentUser: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
      });

      syncSocketUser(data.user.id);

      if (data.walletBalance !== undefined) {
        useWalletStore.getState().setCachedBalance(data.walletBalance);
      }
    } catch (err: any) {
      // Fallback locally if network/server is down
      let fallback = DEMO_PATIENT_1;
      if (userId === DEMO_DOCTOR.id) fallback = DEMO_DOCTOR;
      else if (userId === DEMO_PATIENT_2.id) fallback = DEMO_PATIENT_2;

      set({
        currentUser: fallback,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
      });
      syncSocketUser(fallback.id);
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rehmat_auth_token");
    }
    set({
      currentUser: DEMO_PATIENT_1,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    syncSocketUser(DEMO_PATIENT_1.id);
  },

  checkAuth: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rehmat_auth_token") : null;
    if (!token) {
      set({ isInitialized: true, isAuthenticated: false });
      return;
    }

    try {
      const data = await apiClient.get<{
        user: AuthUser;
        walletBalance?: number;
      }>("/auth/me");

      set({
        currentUser: data.user,
        isAuthenticated: true,
        isInitialized: true,
      });

      syncSocketUser(data.user.id);

      if (data.walletBalance !== undefined) {
        useWalletStore.getState().setCachedBalance(data.walletBalance);
      }
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("rehmat_auth_token");
      }
      set({ token: null, isAuthenticated: false, isInitialized: true });
    }
  },

  switchRole: (role) => {
    const target = role === "patient" ? DEMO_PATIENT_1 : DEMO_DOCTOR;
    get().quickLogin(target.id);
  },

  toggleRole: () => {
    const current = get().currentUser;
    const targetId = current.role === "patient" ? DEMO_DOCTOR.id : DEMO_PATIENT_1.id;
    get().quickLogin(targetId);
  },
}));
