import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { RequestContext, CurrentUser } from "./request-context.js";
import { User } from "../../models/User.js";

export const contextMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const requestId = (req.headers["x-request-id"] as string) || uuidv4();
  const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string);

  let currentUser: CurrentUser | undefined = undefined;

  if (userId) {
    try {
      const user = await User.findByPk(userId);
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
