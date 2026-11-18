import { Request, Response } from "express";
import { BaseController } from "../../core/base/base.controller.js";
import { asyncHandler } from "../../core/async-handler.js";
import { queueService } from "./queue.service.js";
import { RequestContext } from "../../core/context/request-context.js";

export class QueueController extends BaseController {
  join = asyncHandler(async (req: Request, res: Response) => {
    const user = RequestContext.getCurrentUser();
    const { doctorId, type, symptom, patientId, patientName, patientPhone } = req.body;

    const result = await queueService.joinQueue({
      patientId:
        (user.role === "admin" || user.role === "doctor") && patientId
          ? patientId
          : user.role === "patient"
          ? user.id
          : patientId,
      patientName,
      patientPhone,
      doctorId,
      type: type || "clinic",
      symptom,
    });

    return this.created(res, result, "Successfully joined OPD queue");
  });

  getMyStatus = asyncHandler(async (_req: Request, res: Response) => {
    const user = RequestContext.getCurrentUser();
    const status = await queueService.getMyStatus(user.id);
    return this.ok(res, status, "Queue status retrieved successfully");
  });

  leave = asyncHandler(async (_req: Request, res: Response) => {
    const user = RequestContext.getCurrentUser();
    const result = await queueService.leaveQueue(user.id);
    return this.ok(res, result, "Successfully left the queue");
  });

  getDoctorQueue = asyncHandler(async (req: Request, res: Response) => {
    const doctorId = (req.query.doctorId as string) || undefined;
    const queue = await queueService.getDoctorQueue(doctorId);
    return this.ok(res, queue, "OPD Queue retrieved successfully");
  });

  callNext = asyncHandler(async (req: Request, res: Response) => {
    const user = RequestContext.getCurrentUser();
    const nextPatient = await queueService.callNext(user.id);
    return this.ok(res, nextPatient, `Calling patient ${nextPatient.patientName}`);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await queueService.updateStatus(id, status);
    return this.ok(res, updated, `Queue item status updated to ${status}`);
  });
}

export const queueController = new QueueController();
