import { Request, Response } from "express";
import { BaseController } from "../../core/base/base.controller.js";
import { asyncHandler } from "../../core/async-handler.js";
import { walletService } from "./wallet.service.js";

export class WalletController extends BaseController {
  getBalance = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.params.userId as string) || (req.query.userId as string);
    const wallet = await walletService.getOrCreateWallet(userId);
    return this.ok(res, wallet, "Wallet retrieved successfully");
  });

  recharge = asyncHandler(async (req: Request, res: Response) => {
    const result = await walletService.recharge(req.body);
    return this.ok(res, result, "Recharge successful");
  });

  getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.params.userId as string) || (req.query.userId as string);
    const transactions = await walletService.getTransactions(userId);
    return this.ok(res, transactions, "Transactions retrieved successfully");
  });
}

export const walletController = new WalletController();

