import { BaseError } from "./base-error.js";

export class ValidationError extends BaseError {
  readonly statusCode = 400;

  constructor(message = "Validation Error", errors: any[] = []) {
    super(message, errors);
  }

  serializeErrors() {
    if (this.errors.length > 0) {
      return this.errors.map((err) => ({
        message: err.message || "Invalid input",
        field: Array.isArray(err.path) ? err.path.join(".") : undefined,
      }));
    }
    return [{ message: this.message }];
  }
}

export class NotFoundError extends BaseError {
  readonly statusCode = 404;

  constructor(message = "Resource not found") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class UnauthorizedError extends BaseError {
  readonly statusCode = 401;

  constructor(message = "Unauthorized access") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class ForbiddenError extends BaseError {
  readonly statusCode = 403;

  constructor(message = "Access forbidden") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class PaymentRequiredError extends BaseError {
  readonly statusCode = 402;

  constructor(message = "Insufficient wallet balance to proceed with consultation") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class InternalServerError extends BaseError {
  readonly statusCode = 500;

  constructor(message = "Internal Server Error") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

