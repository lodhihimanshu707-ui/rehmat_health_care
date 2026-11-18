import { BaseService } from "../../core/base/base.service.js";
import { QueueItem, User, Wallet, Doctor } from "../../models/index.js";
import { NotFoundError, BadRequestError } from "../../core/errors/domain-errors.js";
import { broadcastQueueUpdate, notifyPatientTurn } from "../../socket/queue.socket.js";
import { Op } from "sequelize";

export interface JoinQueueInput {
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  doctorId?: string;
  type?: "video" | "clinic";
  symptom?: string;
}

export class QueueService extends BaseService {
  private isTableInitialized = false;

  public async ensureTable() {
    if (this.isTableInitialized) return;
    try {
      await QueueItem.sync();
      this.isTableInitialized = true;
    } catch (err: any) {
      console.warn("Queue table sync warning:", err?.message || err);
    }
  }

  /**
   * Patient or Reception Desk joins the live OPD queue
   */
  async joinQueue(input: JoinQueueInput) {
    await this.ensureTable();

    let patient: User | null = null;
    if (input.patientId) {
      patient = await User.findByPk(input.patientId, {
        include: [{ model: Wallet, as: "wallet", attributes: ["balance"] }],
      });
    }

    if (!patient && input.patientPhone) {
      patient = await User.findOne({
        where: { phone: input.patientPhone },
        include: [{ model: Wallet, as: "wallet", attributes: ["balance"] }],
      });
    }

    if (!patient && (input.patientName || input.patientPhone)) {
      const phone = input.patientPhone || `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`;
      patient = await User.create({
        phone,
        name: input.patientName || "Walk-in OPD Patient",
        role: "patient",
        email: `walkin_${Date.now()}@rehmatcare.com`,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(input.patientName || "Walk-in")}`,
      });
      await Wallet.create({ userId: patient.id, balance: 0, currency: "INR" });
    }

    if (!patient) {
      throw new NotFoundError("Patient not found or invalid details provided");
    }

    // Default doctor is Dr. Raees Akhtar
    let doctorId = input.doctorId;
    if (!doctorId) {
      const defaultDoc = await Doctor.findOne();
      doctorId = defaultDoc?.id || "b1000000-0000-0000-0000-000000000001";
    }

    // Check if patient already has an active queue entry
    const existing = await QueueItem.findOne({
      where: {
        patientId: patient.id,
        status: { [Op.in]: ["waiting", "calling", "in_consultation"] },
      },
    });

    if (existing) {
      const position = await this.calculatePosition(existing);
      return {
        item: existing,
        position,
        estimatedWaitMinutes: Math.max(2, (position - 1) * 5),
        isExisting: true,
      };
    }

    // Calculate today's queue sequence
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const countToday = await QueueItem.count({
      where: {
        createdAt: { [Op.gte]: todayStart },
      },
    });

    const queueNumber = countToday + 1;
    const tokenNumber = `RH-${100 + queueNumber}`;

    // Calculate current waiting count for estimated time
    const waitingCount = await QueueItem.count({
      where: {
        status: { [Op.in]: ["waiting", "calling"] },
      },
    });

    const estimatedWaitMinutes = Math.max(2, waitingCount * 5);

    const balance = (patient as any).wallet
      ? Number((patient as any).wallet.balance)
      : 0;

    const item = await QueueItem.create({
      tokenNumber,
      queueNumber,
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientAvatar:
        patient.avatarUrl ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(patient.name)}`,
      patientBalance: balance,
      doctorId,
      type: input.type || "video",
      status: "waiting",
      symptom: input.symptom || "Consultation requested",
      estimatedWaitMinutes,
      joinedAt: new Date(),
    });

    const position = waitingCount + 1;

    // Broadcast update to real-time socket room
    broadcastQueueUpdate({
      action: "joined",
      item,
      position,
    });

    return {
      item,
      position,
      estimatedWaitMinutes,
      isExisting: false,
    };
  }

  /**
   * Get patient's own active token and queue position
   */
  async getMyStatus(patientId: string) {
    await this.ensureTable();
    const item = await QueueItem.findOne({
      where: {
        patientId,
        status: { [Op.in]: ["waiting", "calling", "in_consultation"] },
      },
      order: [["createdAt", "DESC"]],
    });

    if (!item) {
      // Return general queue status
      const totalWaiting = await QueueItem.count({
        where: { status: { [Op.in]: ["waiting", "calling"] } },
      });
      return {
        item: null,
        position: 0,
        estimatedWaitMinutes: Math.max(2, totalWaiting * 5),
        totalWaiting,
      };
    }

    const position = await this.calculatePosition(item);
    const estimatedWaitMinutes = Math.max(2, (position - 1) * 5);

    return {
      item,
      position,
      estimatedWaitMinutes,
    };
  }

  /**
   * Patient cancels/leaves the queue
   */
  async leaveQueue(patientId: string) {
    await this.ensureTable();
    const item = await QueueItem.findOne({
      where: {
        patientId,
        status: { [Op.in]: ["waiting", "calling"] },
      },
    });

    if (!item) {
      return { success: true, message: "No active queue entry to cancel" };
    }

    item.status = "cancelled";
    await item.save();

    broadcastQueueUpdate({
      action: "cancelled",
      itemId: item.id,
    });

    return { success: true, item };
  }

  /**
   * Doctor / Staff fetches active OPD Queue
   */
  async getDoctorQueue(doctorId?: string) {
    await this.ensureTable();
    const where: any = {
      status: { [Op.in]: ["waiting", "calling", "in_consultation", "completed"] },
    };
    if (doctorId) {
      where.doctorId = doctorId;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    where.createdAt = { [Op.gte]: todayStart };

    try {
      const list = await QueueItem.findAll({
        where,
        order: [
          ["status", "ASC"], // calling & in_consultation first, then waiting, then completed
          ["queueNumber", "ASC"],
        ],
      });

      if (list.length === 0) {
        return this.ensureInitialQueue(doctorId);
      }

      return list;
    } catch (err: any) {
      if (err?.name === "SequelizeDatabaseError" || err?.message?.includes("opd_queue")) {
        console.log("🔄 opd_queue table missing, auto-creating table in PostgreSQL...");
        await QueueItem.sync();
        this.isTableInitialized = true;
        return this.ensureInitialQueue(doctorId);
      }
      throw err;
    }
  }

  /**
   * Seed initial active queue if empty
   */
  async ensureInitialQueue(doctorId?: string) {
    const docId = doctorId || "b1000000-0000-0000-0000-000000000001";
    const patients = await User.findAll({
      where: { role: "patient" },
      include: [{ model: Wallet, as: "wallet", attributes: ["balance"] }],
      order: [["createdAt", "ASC"]],
    });

    if (patients.length === 0) return [];

    const defaultConcerns = [
      { symptom: "Fever (102°F), acute throat irritation (Day 2)", type: "video" as const },
      { symptom: "Fasting blood sugar follow-up & BP review", type: "video" as const },
      { symptom: "Chest congestion, productive cough (needs X-Ray)", type: "clinic" as const },
      { symptom: "Stomach ache & hyperacidity review", type: "video" as const },
    ];

    const seeded: QueueItem[] = [];
    for (let i = 0; i < patients.length; i++) {
      const p = patients[i];
      const concern = defaultConcerns[i % defaultConcerns.length];
      const queueNumber = i + 1;
      const tokenNumber = `RH-${100 + queueNumber}`;
      const balance = (p as any).wallet ? Number((p as any).wallet.balance) : 0;

      const item = await QueueItem.create({
        tokenNumber,
        queueNumber,
        patientId: p.id,
        patientName: p.name,
        patientPhone: p.phone,
        patientAvatar:
          p.avatarUrl ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.name)}`,
        patientBalance: balance,
        doctorId: docId,
        type: concern.type,
        status: i === 0 ? "calling" : "waiting",
        symptom: concern.symptom,
        estimatedWaitMinutes: Math.max(2, i * 5),
        joinedAt: new Date(Date.now() - (patients.length - i) * 10 * 60 * 1000),
      });
      seeded.push(item);
    }

    return seeded;
  }

  /**
   * Doctor calls the next waiting patient in line
   */
  async callNext(doctorId: string) {
    await this.ensureTable();
    const nextPatient = await QueueItem.findOne({
      where: {
        status: "waiting",
      },
      order: [["queueNumber", "ASC"]],
    });

    if (!nextPatient) {
      throw new BadRequestError("No patients currently waiting in the queue.");
    }

    nextPatient.status = "calling";
    nextPatient.calledAt = new Date();
    await nextPatient.save();

    // Alert patient device via Socket.io
    notifyPatientTurn(nextPatient.patientId, {
      queueId: nextPatient.id,
      tokenNumber: nextPatient.tokenNumber,
      patientName: nextPatient.patientName,
      type: nextPatient.type,
      message: "Dr. Raees Akhtar is calling you now. Please join your consultation.",
    });

    broadcastQueueUpdate({
      action: "called",
      item: nextPatient,
    });

    return nextPatient;
  }

  /**
   * Doctor updates queue item status
   */
  async updateStatus(
    id: string,
    status: "waiting" | "calling" | "in_consultation" | "completed" | "cancelled"
  ) {
    await this.ensureTable();
    const item = await QueueItem.findByPk(id);
    if (!item) {
      throw new NotFoundError("Queue item not found");
    }

    item.status = status;
    if (status === "completed") {
      item.completedAt = new Date();
    }
    await item.save();

    broadcastQueueUpdate({
      action: "status-updated",
      item,
    });

    return item;
  }

  /**
   * Calculate live 1-based position for waiting queue item
   */
  private async calculatePosition(item: QueueItem): Promise<number> {
    if (item.status === "calling" || item.status === "in_consultation") {
      return 1;
    }
    const precedingCount = await QueueItem.count({
      where: {
        status: { [Op.in]: ["waiting", "calling"] },
        queueNumber: { [Op.lt]: item.queueNumber },
      },
    });
    return precedingCount + 1;
  }
}

export const queueService = new QueueService();
