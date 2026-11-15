import { Request, Response } from "express";
import { BaseController } from "../../core/base/base.controller.js";
import { asyncHandler } from "../../core/async-handler.js";
import { consultationsService } from "./consultations.service.js";

export class ConsultationsController extends BaseController {
  initiate = asyncHandler(async (req: Request, res: Response) => {
    const result = await consultationsService.initiate(req.body);
    return this.created(res, result, "Consultation call initiated");
  });

  accept = asyncHandler(async (req: Request, res: Response) => {
    const consultation = await consultationsService.accept(req.params.id);
    return this.ok(res, consultation, "Consultation connected");
  });

  tick = asyncHandler(async (req: Request, res: Response) => {
    const tickData = await consultationsService.tick(req.params.id, req.body);
    return this.ok(res, tickData, "Tick processed");
  });

  end = asyncHandler(async (req: Request, res: Response) => {
    const consultation = await consultationsService.end(req.params.id, req.body);
    return this.ok(res, consultation, "Consultation concluded");
  });

  getHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.params.userId as string) || (req.query.userId as string);
    const history = await consultationsService.getConsultationHistory(userId);
    return this.ok(res, history, "Consultation history retrieved");
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const consultation = await consultationsService.getById(req.params.id);
    return this.ok(res, consultation, "Consultation retrieved");
  });
}

export const consultationsController = new ConsultationsController();

