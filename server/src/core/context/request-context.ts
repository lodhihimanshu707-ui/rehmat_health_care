import { AsyncLocalStorage } from "node:async_hooks";
import { UnauthorizedError } from "../errors/domain-errors.js";

export interface CurrentUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "patient" | "doctor" | "admin";
  avatarUrl?: string;
}

export interface RequestContextStore {
  currentUser?: CurrentUser;
  requestId: string;
  timestamp: Date;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContextStore>();

export class RequestContext {
  static run<R>(context: RequestContextStore, fn: () => R): R {
    return asyncLocalStorage.run(context, fn);
  }

  static getStore(): RequestContextStore | undefined {
    return asyncLocalStorage.getStore();
  }

  static getCurrentUser(): CurrentUser {
    const store = asyncLocalStorage.getStore();
    if (!store?.currentUser) {
      throw new UnauthorizedError("No active user context found");
    }
    return store.currentUser;
  }

  static getOptionalUser(): CurrentUser | undefined {
    return asyncLocalStorage.getStore()?.currentUser;
  }

  static getRequestId(): string {
    return asyncLocalStorage.getStore()?.requestId || "anonymous";
  }
}
