export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  type: "video" | "audio";
  status: "initiated" | "ringing" | "connected" | "completed" | "ended_zero_balance" | "rejected" | "missed";
  ratePerMinute: number;
  startedAt?: string;
  endedAt?: string;
  durationSeconds: number;
  billedMinutes: number;
  totalCost: number;
  notes?: string;
  doctor?: {
    id: string;
    specialization: string;
    qualifications: string;
    ratePerMinute: number;
    user: {
      name: string;
      avatarUrl?: string;
    };
  };
  patient?: {
    id: string;
    name: string;
    phone: string;
    avatarUrl?: string;
  };
}

export interface TickResponse {
  durationSeconds: number;
  billedMinutes: number;
  liveCost: number;
  currentBalance: number;
  remainingBalance: number;
  remainingMinutes: number;
  remainingSeconds: number;
  isLowBalance: boolean;
  isExhausted: boolean;
}
