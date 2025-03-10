export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code?: number;
    public readonly errors?: Record<string, string>; // Store validation errors

    constructor(message: string, statusCode: number, isOperational = true, code?: number, errors?: Record<string, string>) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        this.errors = errors;

        // Ensures correct prototype chain for instanceof checks
        Object.setPrototypeOf(this, AppError.prototype);

        // Captures the error stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    // Common error types
    static badRequest(message = 'Bad Request', errors?: Record<string, string>, code?: number): AppError {
        return new AppError(message, 400, true, code, errors);
    }

    static unauthorized(message = 'Unauthorized'): AppError {
        return new AppError(message, 401);
    }

    static forbidden(message = 'Forbidden'): AppError {
        return new AppError(message, 403);
    }

    static notFound(message = 'Resource not found'): AppError {
        return new AppError(message, 404);
    }

    static conflict(message = 'Resource already exists'): AppError {
        return new AppError(message, 409);
    }

    static validationError(errors: Record<string, string>, message = 'Validation failed'): AppError {
        return new AppError(message, 422, true, undefined, errors);
    }

    static internalServerError(message = 'Internal server error'): AppError {
        return new AppError(message, 500, false);
    }

    static databaseError(message = 'Database error'): AppError {
        return new AppError(message, 500, false);
    }
}
