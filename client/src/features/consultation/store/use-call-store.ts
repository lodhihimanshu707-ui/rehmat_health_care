import { create } from "zustand";

export type CallStatus = "idle" | "ringing_outgoing" | "incoming" | "connected" | "ended";

export interface ActiveConsultation {
  id: string;
  patientId: string;
  patientName?: string;
  patientAvatar?: string;
  doctorId: string;
  doctorName?: string;
  doctorAvatar?: string;
  doctorSpecialization?: string;
  ratePerMinute: number;
}

export interface CallSummary {
  consultationId: string;
  doctorName: string;
  durationSeconds: number;
  billedMinutes: number;
  totalCost: number;
  ratePerMinute: number;
  endedReason: string;
}

interface CallState {
  callStatus: CallStatus;
  activeConsultation: ActiveConsultation | null;
  durationSeconds: number;
  liveCost: number;
  remainingSeconds: number;
  isLowBalanceAlert: boolean;
  callSummary: CallSummary | null;

  // Actions
  startOutgoingCall: (consultation: ActiveConsultation) => void;
  receiveIncomingCall: (consultation: ActiveConsultation) => void;
  setConnected: () => void;
  updateTick: (data: {
    durationSeconds: number;
    liveCost: number;
    remainingSeconds: number;
    isLowBalance: boolean;
  }) => void;
  endCall: (summary?: CallSummary) => void;
  resetCall: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  callStatus: "idle",
  activeConsultation: null,
  durationSeconds: 0,
  liveCost: 0,
  remainingSeconds: 600,
  isLowBalanceAlert: false,
  callSummary: null,

  startOutgoingCall: (consultation) =>
    set({
      callStatus: "ringing_outgoing",
      activeConsultation: consultation,
      durationSeconds: 0,
      liveCost: 0,
      isLowBalanceAlert: false,
      callSummary: null,
    }),

  receiveIncomingCall: (consultation) =>
    set({
      callStatus: "incoming",
      activeConsultation: consultation,
      durationSeconds: 0,
      liveCost: 0,
      callSummary: null,
    }),

  setConnected: () =>
    set({
      callStatus: "connected",
    }),

  updateTick: ({ durationSeconds, liveCost, remainingSeconds, isLowBalance }) =>
    set({
      durationSeconds,
      liveCost,
      remainingSeconds,
      isLowBalanceAlert: isLowBalance,
    }),

  endCall: (summary) =>
    set((state) => ({
      callStatus: "ended",
      callSummary: summary || state.callSummary,
    })),

  resetCall: () =>
    set({
      callStatus: "idle",
      activeConsultation: null,
      durationSeconds: 0,
      liveCost: 0,
      isLowBalanceAlert: false,
      callSummary: null,
    }),
}));
