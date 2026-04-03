"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(errorCode, message, statusCode = 400) {
        super(message);
        this.errorCode = errorCode;
        this.statusCode = this.getStatusCode(errorCode, statusCode);
    }
    getStatusCode(errorCode, defaultStatusCode) {
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
exports.AppError = AppError;
