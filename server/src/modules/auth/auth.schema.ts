import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor"]).default("patient"),
});

export const loginSchema = z.object({
  identifier: z.string().min(3, "Please enter your phone number or email"),
  password: z.string().min(1, "Password is required"),
});

export const quickLoginSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type QuickLoginInput = z.infer<typeof quickLoginSchema>;

