import { Router } from "express";
import { walletController } from "./wallet.controller.js";
import { validate } from "../../core/validate.middleware.js";
import { rechargeWalletSchema } from "./wallet.schema.js";
import { requireAuth, requireRole } from "../../core/auth/auth.middleware.js";

const router = Router();

// Wallet queries require authentication
router.get("/:userId?", requireAuth, walletController.getBalance);

// Wallet recharges require authentication (patients or admin)
router.post(
  "/recharge",
  requireAuth,
  requireRole("patient", "admin"),
  validate(rechargeWalletSchema),
  walletController.recharge
);

// Transaction history requires authentication
router.get("/:userId/transactions", requireAuth, walletController.getTransactions);

export default router;
