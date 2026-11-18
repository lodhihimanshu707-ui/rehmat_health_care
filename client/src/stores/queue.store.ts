import { create } from "zustand";
import { apiClient } from "@/api/client";
import { getSocket } from "@/lib/socket";

export interface QueueItem {
  id: string;
  tokenNumber: string;
  queueNumber: number;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientAvatar?: string;
  patientBalance?: number;
  doctorId: string;
  type: "video" | "clinic";
  status: "waiting" | "calling" | "in_consultation" | "completed" | "cancelled";
  symptom?: string;
  estimatedWaitMinutes: number;
  joinedAt: string;
  calledAt?: string;
  completedAt?: string;
}

interface QueueState {
  myQueueItem: QueueItem | null;
  myPosition: number;
  estimatedWaitMinutes: number;
  totalWaiting: number;
  doctorQueueList: QueueItem[];
  isLoading: boolean;
  isJoining: boolean;
  isLeaving: boolean;
  isCallingNext: boolean;
  calledAlert: {
    tokenNumber: string;
    message: string;
  } | null;

  // Actions
  joinQueue: (type?: "video" | "clinic", symptom?: string) => Promise<void>;
  fetchMyStatus: () => Promise<void>;
  leaveQueue: () => Promise<void>;
  fetchDoctorQueue: (doctorId?: string) => Promise<void>;
  callNext: () => Promise<QueueItem | null>;
  updateQueueStatus: (
    id: string,
    status: "waiting" | "calling" | "in_consultation" | "completed" | "cancelled"
  ) => Promise<void>;
  dismissCalledAlert: () => void;
  initSocketListeners: () => () => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  myQueueItem: null,
  myPosition: 0,
  estimatedWaitMinutes: 0,
  totalWaiting: 0,
  doctorQueueList: [],
  isLoading: false,
  isJoining: false,
  isLeaving: false,
  isCallingNext: false,
  calledAlert: null,

  joinQueue: async (type = "video", symptom = "General Teleconsultation") => {
    set({ isJoining: true });
    try {
      const res: any = await apiClient.post("/queue/join", {
        type,
        symptom,
      });

      const data = res?.item ? res : res?.data || res;
      set({
        myQueueItem: data.item || data,
        myPosition: data.position || 1,
        estimatedWaitMinutes: data.estimatedWaitMinutes || 5,
        isJoining: false,
      });
    } catch (err: any) {
      set({ isJoining: false });
      console.warn("Failed to join queue:", err);
      throw err;
    }
  },

  fetchMyStatus: async () => {
    try {
      const res: any = await apiClient.get("/queue/status");
      const data = res?.item !== undefined ? res : res?.data || {};

      set({
        myQueueItem: data.item || null,
        myPosition: data.position || 0,
        estimatedWaitMinutes: data.estimatedWaitMinutes || 0,
        totalWaiting: data.totalWaiting || 0,
      });
    } catch (err) {
      // Quiet fail if not authenticated yet
    }
  },

  leaveQueue: async () => {
    set({ isLeaving: true });
    try {
      await apiClient.delete("/queue/leave");
      set({
        myQueueItem: null,
        myPosition: 0,
        estimatedWaitMinutes: 0,
        isLeaving: false,
      });
    } catch (err) {
      set({ isLeaving: false });
    }
  },

  fetchDoctorQueue: async (doctorId?: string) => {
    set({ isLoading: true });
    try {
      const url = doctorId ? `/queue?doctorId=${doctorId}` : "/queue";
      const res: any = await apiClient.get(url);
      const list = Array.isArray(res) ? res : res?.data || [];
      set({ doctorQueueList: list, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      console.warn("Failed to fetch doctor queue:", err);
    }
  },

  callNext: async () => {
    set({ isCallingNext: true });
    try {
      const res: any = await apiClient.post("/queue/call-next");
      const nextPat = res?.patientName ? res : res?.data || res;
      set({ isCallingNext: false });
      await get().fetchDoctorQueue();
      return nextPat;
    } catch (err: any) {
      set({ isCallingNext: false });
      alert(err.message || "No patients currently waiting in line.");
      return null;
    }
  },

  updateQueueStatus: async (id, status) => {
    try {
      await apiClient.patch(`/queue/${id}/status`, { status });
      await get().fetchDoctorQueue();
    } catch (err) {
      console.warn("Failed to update queue item status:", err);
    }
  },

  dismissCalledAlert: () => set({ calledAlert: null }),

  initSocketListeners: () => {
    const socket = getSocket();
    socket.emit("join-queue-room");

    const handleQueueUpdated = () => {
      // Refresh status automatically
      get().fetchMyStatus();
      get().fetchDoctorQueue();
    };

    const handleQueueCalled = (data: any) => {
      set({
        calledAlert: {
          tokenNumber: data.tokenNumber || "RH-OPD",
          message: data.message || "Dr. Raees Akhtar is calling you now!",
        },
      });
    };

    socket.on("queue-updated", handleQueueUpdated);
    socket.on("queue-called", handleQueueCalled);

    return () => {
      socket.off("queue-updated", handleQueueUpdated);
      socket.off("queue-called", handleQueueCalled);
      socket.emit("leave-queue-room");
    };
  },
}));
