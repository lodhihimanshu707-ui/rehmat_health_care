import { create } from "zustand";

export interface DemoUser {
  id: string;
  name: string;
  phone: string;
  role: "patient" | "doctor";
  avatarUrl: string;
  subtitle: string;
}

export const DEMO_PATIENT: DemoUser = {
  id: "p1000000-0000-0000-0000-000000000001",
  name: "Mohd. Imran",
  phone: "+91 94120 54321",
  role: "patient",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  subtitle: "Registered Patient (Malviya Nagar)",
};

export const DEMO_DOCTOR: DemoUser = {
  id: "d1000000-0000-0000-0000-000000000001",
  name: "Dr. Rehmat Ali",
  phone: "+91 98370 12345",
  role: "doctor",
  avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
  subtitle: "MBBS, MD - General Physician (₹15/min)",
};

interface AuthState {
  currentUser: DemoUser;
  switchRole: (role: "patient" | "doctor") => void;
  toggleRole: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: DEMO_PATIENT,
  switchRole: (role) =>
    set({
      currentUser: role === "patient" ? DEMO_PATIENT : DEMO_DOCTOR,
    }),
  toggleRole: () =>
    set((state) => ({
      currentUser: state.currentUser.role === "patient" ? DEMO_DOCTOR : DEMO_PATIENT,
    })),
}));

