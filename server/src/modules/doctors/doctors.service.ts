import { BaseService } from "../../core/base/base.service.js";
import { Doctor, User } from "../../models/index.js";
import { NotFoundError } from "../../core/errors/domain-errors.js";

export class DoctorsService extends BaseService {
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
    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "phone", "email", "avatarUrl"],
        },
      ],
    });
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

