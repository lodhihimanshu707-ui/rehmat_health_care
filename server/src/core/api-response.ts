export class ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  timestamp: string;

  constructor(statusCode: number, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode >= 200 && statusCode < 400;
    this.timestamp = new Date().toISOString();
  }
}

