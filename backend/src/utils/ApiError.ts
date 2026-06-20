export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message: string, details?: unknown) {
    return new ApiError(401, message, details);
  }

  static forbidden(message: string, details?: unknown) {
    return new ApiError(403, message, details);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }
}
