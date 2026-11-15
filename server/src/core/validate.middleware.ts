import { AnyZodObject, ZodError } from "zod";
import { asyncHandler } from "./async-handler.js";
import { ValidationError } from "./errors/domain-errors.js";

export const validate = (schema: AnyZodObject) =>
  asyncHandler(async (req, _res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError("Invalid request data", error.errors);
      }
      throw error;
    }
  });

