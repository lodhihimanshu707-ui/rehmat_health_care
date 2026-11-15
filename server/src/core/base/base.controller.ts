import { Response } from "express";
import { ApiResponse } from "../api-response.js";

export abstract class BaseController {
  protected ok<T>(res: Response, data: T, message = "Success"): Response {
    return res.status(200).json(new ApiResponse(200, data, message));
  }

  protected created<T>(res: Response, data: T, message = "Resource created successfully"): Response {
    return res.status(201).json(new ApiResponse(201, data, message));
  }

  protected noContent(res: Response): Response {
    return res.status(204).send();
  }
}
