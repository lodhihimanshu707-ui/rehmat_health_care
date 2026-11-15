import { Transaction } from "sequelize";
import { RequestContext, CurrentUser } from "../context/request-context.js";
import { sequelize } from "../../config/database.js";

export abstract class BaseService {
  /**
   * Retrieves the current authenticated user context from AsyncLocalStorage.
   * Throws UnauthorizedError if no user is present in the current execution context.
   */
  protected get currentUser(): CurrentUser {
    return RequestContext.getCurrentUser();
  }

  /**
   * Safe getter for optional user context.
   */
  protected get optionalUser(): CurrentUser | undefined {
    return RequestContext.getOptionalUser();
  }

  /**
   * Convenience getter for current user's ID.
   */
  protected get currentUserId(): string {
    return this.currentUser.id;
  }

  /**
   * Convenience getter for current user's role.
   */
  protected get currentUserRole(): "patient" | "doctor" | "admin" {
    return this.currentUser.role;
  }

  /**
   * Runs an operation inside an atomic database transaction.
   */
  protected async withTransaction<T>(operation: (transaction: Transaction) => Promise<T>): Promise<T> {
    return sequelize.transaction(operation);
  }
}
