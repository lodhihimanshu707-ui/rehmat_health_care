import { v4 as uuidv4 } from "uuid";
import { BaseService } from "../../core/base/base.service.js";
import { Consultation } from "../../models/Consultation.js";
import { Doctor } from "../../models/Doctor.js";
import { Wallet } from "../../models/Wallet.js";
import { Transaction } from "../../models/Transaction.js";
import { User } from "../../models/User.js";
import { NotFoundError, PaymentRequiredError } from "../../core/errors/domain-errors.js";
import { InitiateConsultationInput, TickConsultationInput, EndConsultationInput } from "./consultations.schema.js";

export class ConsultationsService extends BaseService {
  async initiate(input: InitiateConsultationInput) {
    const patientId = input.patientId || this.currentUserId;

    const doctor = await Doctor.findByPk(input.doctorId, {
      include: [{ model: User, as: "user", attributes: ["name", "avatarUrl"] }],
    });
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    // Verify patient wallet has at least 1 minute of credit
    const wallet = await Wallet.findOne({ where: { userId: patientId } });
    const currentBalance = wallet ? Number(wallet.balance) : 0;
    const requiredRate = Number(doctor.ratePerMinute);

    if (currentBalance < requiredRate) {
      throw new PaymentRequiredError(
        `Insufficient balance. You need at least ₹${requiredRate.toFixed(2)} for 1 minute of consultation.`
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
    const consultation = await Consultation.findByPk(consultationId);
    if (!consultation) throw new NotFoundError("Consultation not found");

    consultation.status = "connected";
    consultation.startedAt = new Date();
    await consultation.save();

    return consultation;
  }

  async tick(consultationId: string, input: TickConsultationInput) {
    const consultation = await Consultation.findByPk(consultationId);
    if (!consultation) throw new NotFoundError("Consultation not found");

    const durationSeconds = input.durationSeconds;
    const ratePerMinute = Number(consultation.ratePerMinute);
    const billedMinutes = Math.max(1, Math.ceil(durationSeconds / 60));
    const liveCost = billedMinutes * ratePerMinute;

    const wallet = await Wallet.findOne({ where: { userId: consultation.patientId } });
    const currentBalance = wallet ? Number(wallet.balance) : 0;
    const remainingBalance = Math.max(0, currentBalance - liveCost);
    const remainingMinutes = Math.floor(remainingBalance / ratePerMinute);
    const remainingSeconds = Math.max(0, Math.floor((remainingBalance / ratePerMinute) * 60));

    const isLowBalance = remainingBalance < ratePerMinute;
    const isExhausted = currentBalance <= liveCost;

    return {
      durationSeconds,
      billedMinutes,
      liveCost,
      currentBalance,
      remainingBalance,
      remainingMinutes,
      remainingSeconds,
      isLowBalance,
      isExhausted,
    };
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
      const billedMinutes = Math.max(1, Math.ceil(durationSeconds / 60));
      const totalCost = billedMinutes * ratePerMinute;

      // Lock and deduct from wallet
      const wallet = await Wallet.findOne({
        where: { userId: consultation.patientId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (wallet) {
        const actualDeduction = Math.min(Number(wallet.balance), totalCost);
        wallet.balance = Math.max(0, Number(wallet.balance) - actualDeduction);
        await wallet.save({ transaction: t });

        const txnRef = `CALL-${uuidv4().substring(0, 8).toUpperCase()}`;
        await Transaction.create(
          {
            walletId: wallet.id,
            type: "debit",
            amount: actualDeduction,
            paymentMethod: "Wallet",
            referenceId: txnRef,
            status: "success",
            description: `Video Consultation fee (${billedMinutes} min @ ₹${ratePerMinute}/min)`,
          },
          { transaction: t }
        );
      }

      consultation.endedAt = new Date();
      consultation.durationSeconds = durationSeconds;
      consultation.billedMinutes = billedMinutes;
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
