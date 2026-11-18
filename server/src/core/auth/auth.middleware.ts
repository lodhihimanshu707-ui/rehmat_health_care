import { Request, Response, NextFunction } from "express";
import { RequestContext } from "../context/request-context.js";
import { UnauthorizedError, ForbiddenError } from "../errors/domain-errors.js";

export const requireAuth = (_req: Request, _res: Response, next: NextFunction) => {
  const user = RequestContext.getOptionalUser();
  if (!user) {
    throw new UnauthorizedError("Authentication required. Please login to access this resource.");
  }
  next();
};

export const requireRole = (...allowedRoles: string[]) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    const user = RequestContext.getOptionalUser();
    if (!user) {
      throw new UnauthorizedError("Authentication required. Please login.");
    }
    // Admin has universal superuser access across all modules
    if (user.role === "admin") {
      return next();
    }
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError(
        `Access forbidden. Requires one of roles: [${allowedRoles.join(", ")}]. Current role: ${user.role}`
      );
    }
    next();
  };
};
