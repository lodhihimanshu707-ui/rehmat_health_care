import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { RequestContext, CurrentUser } from "./request-context.js";
import { User } from "../../models/User.js";
import { verifyToken } from "../auth/jwt.util.js";

export const contextMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const requestId = (req.headers["x-request-id"] as string) || uuidv4();
  let currentUser: CurrentUser | undefined = undefined;

  // 1. Check Bearer Token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    try {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        const user = await User.findByPk(decoded.id);
        if (user) {
          currentUser = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
          };
        }
      }
    } catch {
      // Invalid/expired token; ignore and fallback
    }
  }

  // 2. Fallback to x-user-id header or userId query parameter (for dev/demo backwards compatibility)
  if (!currentUser) {
    const fallbackUserId = (req.headers["x-user-id"] as string) || (req.query.userId as string);
    if (fallbackUserId) {
      try {
        const user = await User.findByPk(fallbackUserId);
        if (user) {
          currentUser = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
          };
        }
      } catch {
        // In case database isn't initialized yet or user doesn't exist
      }
    }
  }

  RequestContext.run(
    {
      currentUser,
      requestId,
      timestamp: new Date(),
    },
    () => {
      next();
    }
  );
};
