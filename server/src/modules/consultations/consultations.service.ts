import { v4 as uuidv4 } from "uuid";
import { BaseService } from "../../core/base/base.service.js";
import { Consultation, Doctor, Wallet, Transaction, User } from "../../models/index.js";
import { NotFoundError, PaymentRequiredError } from "../../core/errors/domain-errors.js";
import { InitiateConsultationInput, TickConsultationInput, EndConsultationInput } from "./consultations.schema.js";
import { getIO } from "../../socket/index.js";

export class ConsultationsService extends BaseService {
  async initiate(input: InitiateConsultationInput) {
    const patientId = input.patientId || this.currentUserId;

    let doctor = await Doctor.findByPk(input.doctorId, {
      include: [{ model: User, as: "user", attributes: ["name", "avatarUrl"] }],
    });
    if (!doctor) {
      doctor = await Doctor.findOne({
        where: { userId: input.doctorId },
        include: [{ model: User, as: "user", attributes: ["name", "avatarUrl"] }],
      });
    }
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    // Verify patient wallet has at least 1 minute of credit
    const wallet = await Wallet.findOne({ where: { userId: patientId } });
    const currentBalance = wallet ? Number(wallet.balance) : 0;
    const requiredRate = Number(doctor.ratePerMinute);

    if (currentBalance < requiredRate) {
      throw new PaymentRequiredError(
        `Insufficient balance. You need at least ₹${requiredRate.toFixed(2)} in your Health Wallet for 1 minute of consultation.`
      );
    }

    const consultation = await Consultation.create({
      patientId,
      doctorId: doctor.id,
      type: input.type || "video",
      status: "ringing",
      ratePerMinute: requiredRate,
      durationSeconds: 0,
      billedMinutes: 0,
      totalCost: 0,
    });

    return {
      consultation,
      doctor,
      walletBalance: currentBalance,
    };
  }

  async accept(consultationId: string) {
    return this.withTransaction(async (t) => {
      const consultation = await Consultation.findByPk(consultationId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!consultation) throw new NotFoundError("Consultation not found");

      consultation.status = "connected";
      consultation.startedAt = new Date();

      const ratePerMinute = Number(consultation.ratePerMinute);
      const wallet = await Wallet.findOne({
        where: { userId: consultation.patientId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      // Deduct minute 1 immediately as the call connects
      if (wallet && Number(wallet.balance) >= ratePerMinute && (consultation.billedMinutes || 0) === 0) {
        const newBalance = Number((Number(wallet.balance) - ratePerMinute).toFixed(2));
        wallet.balance = newBalance;
        await wallet.save({ transaction: t });

        consultation.billedMinutes = 1;
        consultation.totalCost = ratePerMinute;
        consultation.durationSeconds = 1;

        const txnRef = `CALL-${uuidv4().substring(0, 8).toUpperCase()}`;
        await Transaction.create(
          {
            walletId: wallet.id,
            type: "debit",
            amount: ratePerMinute,
            paymentMethod: "Wallet",
            referenceId: txnRef,
            status: "success",
            description: `Live Video Consultation - Minute 1 fee (₹${ratePerMinute}/min)`,
          },
          { transaction: t }
        );

        // Notify client via socket of real-time wallet debit
        getIO()?.to(`user:${consultation.patientId}`).emit("wallet-updated", {
          balance: newBalance,
        });
      }

      await consultation.save({ transaction: t });
      return consultation;
    });
  }

  async tick(consultationId: string, input: TickConsultationInput) {
    return this.withTransaction(async (t) => {
      const consultation = await Consultation.findByPk(consultationId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!consultation) throw new NotFoundError("Consultation not found");

      if (consultation.status === "completed" || consultation.status === "ended_zero_balance") {
        return {
          durationSeconds: consultation.durationSeconds,
          billedMinutes: consultation.billedMinutes,
          liveCost: consultation.totalCost,
          currentBalance: 0,
          remainingBalance: 0,
          remainingMinutes: 0,
          remainingSeconds: 0,
          isLowBalance: false,
          isExhausted: true,
        };
      }

      const durationSeconds = input.durationSeconds;
      const ratePerMinute = Number(consultation.ratePerMinute);
      const neededMinutes = Math.max(1, Math.ceil(durationSeconds / 60));

      const wallet = await Wallet.findOne({
        where: { userId: consultation.patientId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      let currentBalance = wallet ? Number(wallet.balance) : 0;
      let billedMinutes = consultation.billedMinutes || 0;
      let totalCost = Number(consultation.totalCost) || 0;

      // Check if we need to deduct for a new minute in real time
      const unbilledMinutes = neededMinutes - billedMinutes;

      if (unbilledMinutes > 0 && wallet) {
        const costToDeduct = Number((unbilledMinutes * ratePerMinute).toFixed(2));

        if (currentBalance >= costToDeduct) {
          // Sufficient funds: cut payment for the minute(s)
          currentBalance = Number((currentBalance - costToDeduct).toFixed(2));
          wallet.balance = currentBalance;
          await wallet.save({ transaction: t });

          billedMinutes = neededMinutes;
          totalCost = Number((totalCost + costToDeduct).toFixed(2));

          consultation.billedMinutes = billedMinutes;
          consultation.totalCost = totalCost;
          consultation.durationSeconds = durationSeconds;
          await consultation.save({ transaction: t });

          const txnRef = `CALL-${uuidv4().substring(0, 8).toUpperCase()}`;
          await Transaction.create(
            {
              walletId: wallet.id,
              type: "debit",
              amount: costToDeduct,
              paymentMethod: "Wallet",
              referenceId: txnRef,
              status: "success",
              description: `Live Video Consultation - Minute ${billedMinutes} fee (₹${ratePerMinute}/min)`,
            },
            { transaction: t }
          );

          // Real-time broadcast to user's wallet UI
          getIO()?.to(`user:${consultation.patientId}`).emit("wallet-updated", {
            balance: currentBalance,
          });
        } else {
          // Insufficient funds for the next minute: automatically end call
          consultation.durationSeconds = durationSeconds;
          consultation.status = "ended_zero_balance";
          consultation.endedAt = new Date();
          await consultation.save({ transaction: t });

          return {
            durationSeconds,
            billedMinutes,
            liveCost: totalCost,
            currentBalance,
            remainingBalance: currentBalance,
            remainingMinutes: 0,
            remainingSeconds: 0,
            isLowBalance: true,
            isExhausted: true,
          };
        }
      } else {
        consultation.durationSeconds = durationSeconds;
        await consultation.save({ transaction: t });
      }

      const remainingBalance = currentBalance;
      const remainingMinutes = Math.floor(remainingBalance / ratePerMinute);
      const remainingSeconds = Math.max(0, Math.floor((remainingBalance / ratePerMinute) * 60));
      const isLowBalance = remainingBalance < ratePerMinute;
      const isExhausted = remainingBalance < ratePerMinute && (durationSeconds % 60 === 0 || remainingSeconds <= 0);

      return {
        durationSeconds,
        billedMinutes,
        liveCost: totalCost,
        currentBalance,
        remainingBalance,
        remainingMinutes,
        remainingSeconds,
        isLowBalance,
        isExhausted,
      };
    });
  }

  async end(consultationId: string, input: EndConsultationInput) {
    return this.withTransaction(async (t) => {
      const consultation = await Consultation.findByPk(consultationId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!consultation) throw new NotFoundError("Consultation not found");

      if (consultation.status === "completed" || consultation.status === "ended_zero_balance") {
        return consultation;
      }

      const durationSeconds = input.durationSeconds || consultation.durationSeconds || 1;
      const ratePerMinute = Number(consultation.ratePerMinute);
      const neededMinutes = Math.max(1, Math.ceil(durationSeconds / 60));
      let billedMinutes = consultation.billedMinutes || 0;
      let totalCost = Number(consultation.totalCost) || 0;

      // Reconcile any unbilled minutes
      const unbilledMinutes = Math.max(0, neededMinutes - billedMinutes);

      const wallet = await Wallet.findOne({
        where: { userId: consultation.patientId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (unbilledMinutes > 0 && wallet) {
        const costToDeduct = Math.min(Number(wallet.balance), unbilledMinutes * ratePerMinute);
        const actualBilledMins = Math.ceil(costToDeduct / ratePerMinute);

        wallet.balance = Math.max(0, Number((Number(wallet.balance) - costToDeduct).toFixed(2)));
        await wallet.save({ transaction: t });

        billedMinutes += actualBilledMins;
        totalCost = Number((totalCost + costToDeduct).toFixed(2));

        const txnRef = `CALL-${uuidv4().substring(0, 8).toUpperCase()}`;
        await Transaction.create(
          {
            walletId: wallet.id,
            type: "debit",
            amount: costToDeduct,
            paymentMethod: "Wallet",
            referenceId: txnRef,
            status: "success",
            description: `Live Video Consultation final minute fee (${actualBilledMins} min @ ₹${ratePerMinute}/min)`,
          },
          { transaction: t }
        );

        getIO()?.to(`user:${consultation.patientId}`).emit("wallet-updated", {
          balance: Number(wallet.balance),
        });
      }

      consultation.endedAt = new Date();
      consultation.durationSeconds = durationSeconds;
      consultation.billedMinutes = Math.max(1, billedMinutes);
      consultation.totalCost = totalCost;
      consultation.status = input.reason === "ended_zero_balance" ? "ended_zero_balance" : "completed";
      if (input.notes) consultation.notes = input.notes;
      await consultation.save({ transaction: t });

      return consultation;
    });
  }

  async getConsultationHistory(userId?: string) {
    const targetUserId = userId || this.optionalUser?.id;
    if (!targetUserId) throw new NotFoundError("User ID required");

    return Consultation.findAll({
      where: { patientId: targetUserId },
      include: [
        {
          model: Doctor,
          as: "doctor",
          include: [{ model: User, as: "user", attributes: ["name", "avatarUrl"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
  }

  async getById(id: string) {
    const consultation = await Consultation.findByPk(id, {
      include: [
        { model: User, as: "patient", attributes: ["id", "name", "phone", "avatarUrl"] },
        {
          model: Doctor,
          as: "doctor",
          include: [{ model: User, as: "user", attributes: ["id", "name", "avatarUrl"] }],
        },
      ],
    });
    if (!consultation) throw new NotFoundError("Consultation not found");
    return consultation;
  }
}

export const consultationsService = new ConsultationsService();
