import { Router } from "express";
import { walletController } from "./wallet.controller.js";
import { validate } from "../../core/validate.middleware.js";
import { rechargeWalletSchema } from "./wallet.schema.js";

const router = Router();

router.get("/:userId?", walletController.getBalance);
router.post("/recharge", validate(rechargeWalletSchema), walletController.recharge);
router.get("/:userId/transactions", walletController.getTransactions);

export default router;
