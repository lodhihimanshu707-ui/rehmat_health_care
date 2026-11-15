import { Request, Response } from "express";
import { BaseController } from "../../core/base/base.controller.js";
import { asyncHandler } from "../../core/async-handler.js";
import { doctorsService } from "./doctors.service.js";

export class DoctorsController extends BaseController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const doctors = await doctorsService.getAllDoctors();
    return this.ok(res, doctors, "Doctors retrieved successfully");
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const doctor = await doctorsService.getDoctorById(req.params.id);
    return this.ok(res, doctor, "Doctor details retrieved successfully");
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { isOnline, isBusy } = req.body;
    const doctor = await doctorsService.toggleDoctorStatus(req.params.id, isOnline, isBusy);
    return this.ok(res, doctor, "Doctor status updated successfully");
  });
}

export const doctorsController = new DoctorsController();
