export class ApiError extends Error {
  statusCode: number;
  errors: any[];

  constructor(message: string, statusCode = 500, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function handleApiError(error: any): ApiError {
  if (error.response?.data) {
    const data = error.response.data;
    return new ApiError(data.message || "Request failed", data.statusCode || error.response.status, data.errors || []);
  }
  return new ApiError(error.message || "Network error", 500);
}

