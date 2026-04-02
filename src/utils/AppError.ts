export class AppError extends Error {
  public readonly errorCode: string;
  public readonly statusCode: number;

  constructor(errorCode: string, message: string, statusCode: number = 400) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = this.getStatusCode(errorCode, statusCode);
  }

  private getStatusCode(errorCode: string, defaultStatusCode: number): number {
    switch (errorCode) {
      case 'VALIDATION_ERROR':
        return 400;
      case 'UNAUTHORIZED':
        return 401;
      case 'FORBIDDEN':
        return 403;
      case 'NOT_FOUND':
        return 404;
      case 'INTERNAL_ERROR':
        return 500;
      default:
        return defaultStatusCode;
    }
  }
}
