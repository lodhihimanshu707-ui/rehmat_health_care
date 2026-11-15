import { z } from "zod";

export const initiateConsultationSchema = z.object({
  patientId: z.string().uuid().optional(),
  doctorId: z.string(),
  type: z.enum(["video", "audio"]).default("video"),
});

export const tickConsultationSchema = z.object({
  durationSeconds: z.number().min(0),
});

export const endConsultationSchema = z.object({
  durationSeconds: z.number().min(0),
  reason: z.enum(["user_ended", "ended_zero_balance", "error"]).default("user_ended"),
  notes: z.string().optional(),
});

export type InitiateConsultationInput = z.infer<typeof initiateConsultationSchema>;
export type TickConsultationInput = z.infer<typeof tickConsultationSchema>;
export type EndConsultationInput = z.infer<typeof endConsultationSchema>;

