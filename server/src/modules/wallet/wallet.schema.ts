import { z } from "zod";

export const rechargeWalletSchema = z.object({
  userId: z.string().uuid().optional(),
  amount: z.number().min(10, "Minimum recharge amount is ₹10"),
  paymentMethod: z.string().default("UPI"),
  description: z.string().optional(),
});

export type RechargeWalletInput = z.infer<typeof rechargeWalletSchema>;
