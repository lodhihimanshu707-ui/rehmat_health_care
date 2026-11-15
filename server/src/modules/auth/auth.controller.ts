import { Request, Response } from "express";
import { BaseController } from "../../core/base/base.controller.js";
import { asyncHandler } from "../../core/async-handler.js";
import { AuthService } from "./auth.service.js";

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    return this.created(res, result, "Account registered successfully.");
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    return this.ok(res, result, "Logged in successfully.");
  });

  quickLogin = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.quickLogin(req.body.userId);
    return this.ok(res, result, "Quick demo login successful.");
  });

  me = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.authService.getMe();
    return this.ok(res, result, "User profile retrieved.");
  });

  logout = asyncHandler(async (_req: Request, res: Response) => {
    return this.ok(res, null, "Logged out successfully.");
  });
}
