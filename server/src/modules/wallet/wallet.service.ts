import { v4 as uuidv4 } from "uuid";
import { BaseService } from "../../core/base/base.service.js";
import { Wallet, Transaction } from "../../models/index.js";
import { NotFoundError } from "../../core/errors/domain-errors.js";
import { RechargeWalletInput } from "./wallet.schema.js";

export class WalletService extends BaseService {
  async getOrCreateWallet(userId?: string) {
    const targetUserId = userId || this.optionalUser?.id;
    if (!targetUserId) {
      throw new NotFoundError("User ID not specified");
    }

    let wallet = await Wallet.findOne({
      where: { userId: targetUserId },
      include: [
        {
          model: Transaction,
          as: "transactions",
          limit: 20,
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: targetUserId,
        balance: 0.0,
        currency: "INR",
      });
    }

    return wallet;
  }

  async recharge(input: RechargeWalletInput) {
    const targetUserId = input.userId || this.currentUserId;

    return this.withTransaction(async (t) => {
      let wallet = await Wallet.findOne({
        where: { userId: targetUserId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!wallet) {
        wallet = await Wallet.create(
          {
            userId: targetUserId,
            balance: 0.0,
            currency: "INR",
          },
          { transaction: t }
        );
      }

      const newBalance = Number(wallet.balance) + Number(input.amount);
      wallet.balance = newBalance;
      await wallet.save({ transaction: t });

      const txnRef = `TXN-${uuidv4().substring(0, 8).toUpperCase()}`;

      const transactionRecord = await Transaction.create(
        {
          walletId: wallet.id,
          type: "credit",
          amount: input.amount,
          paymentMethod: input.paymentMethod || "UPI (Google Pay)",
          referenceId: txnRef,
          status: "success",
          description: input.description || `Wallet Recharge of ₹${input.amount}`,
        },
        { transaction: t }
      );

      return {
        wallet,
        transaction: transactionRecord,
      };
    });
  }

  async getTransactions(userId?: string) {
    const targetUserId = userId || this.optionalUser?.id;
    if (!targetUserId) {
      throw new NotFoundError("User ID not specified");
    }

    const wallet = await Wallet.findOne({ where: { userId: targetUserId } });
    if (!wallet) return [];

    return Transaction.findAll({
      where: { walletId: wallet.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
  }
}

export const walletService = new WalletService();

