import { BaseService } from "../../core/base/base.service.js";
import { Doctor, User, Wallet } from "../../models/index.js";
import { NotFoundError } from "../../core/errors/domain-errors.js";
import { queueService } from "../queue/queue.service.js";

export class DoctorsService extends BaseService {
  async getPatientsQueue() {
    const queueItems = await queueService.getDoctorQueue();
    return queueItems.map((item) => ({
      id: item.patientId,
      queueItemId: item.id,
      tokenNumber: item.tokenNumber,
      queueNumber: item.queueNumber,
      name: item.patientName,
      phone: item.patientPhone,
      balance: item.patientBalance ? Number(item.patientBalance) : 0,
      avatarUrl: item.patientAvatar,
      type: item.type,
      status: item.status,
      lastSeen: `Token #${item.tokenNumber} • ${item.status === "calling" ? "Calling Now" : item.status === "in_consultation" ? "In Consult" : "Waiting"}`,
      symptom: item.symptom || "Consultation requested",
      estimatedWaitMinutes: item.estimatedWaitMinutes,
      joinedAt: item.joinedAt,
    }));
  }

  async getAllDoctors() {
    return Doctor.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "phone", "email", "avatarUrl"],
        },
      ],
      order: [["rating", "DESC"]],
    });
  }

  async getDoctorById(id: string) {
    let doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "phone", "email", "avatarUrl"],
        },
      ],
    });
    if (!doctor) {
      doctor = await Doctor.findOne({
        where: { userId: id },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "phone", "email", "avatarUrl"],
          },
        ],
      });
    }
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }
    return doctor;
  }

  async toggleDoctorStatus(id: string, isOnline?: boolean, isBusy?: boolean) {
    const doctor = await this.getDoctorById(id);
    if (isOnline !== undefined) doctor.isOnline = isOnline;
    if (isBusy !== undefined) doctor.isBusy = isBusy;
    await doctor.save();
    return doctor;
  }
}

export const doctorsService = new DoctorsService();

