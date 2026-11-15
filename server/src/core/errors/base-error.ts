export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  readonly isOperational: boolean = true;
  readonly errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

export class ApiError extends BaseError {
  readonly statusCode: number;

  constructor(statusCode: number, message = "Something went wrong", errors: any[] = []) {
    super(message, errors);
    this.statusCode = statusCode;
  }

  serializeErrors() {
    if (this.errors.length > 0) {
      return this.errors.map((err) => ({
        message: err.message || String(err),
        field: err.path ? err.path.join(".") : undefined,
      }));
    }
    return [{ message: this.message }];
  }
}
