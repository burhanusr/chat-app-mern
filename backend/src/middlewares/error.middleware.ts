import { Request, Response, NextFunction } from 'express';
import { AppError } from './../utils/error.util';

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error]: ${err.message}`);
    console.error(err.stack);

    let statusCode = 500;
    let message = 'Something went wrong';
    let errorCode: number | undefined;
    let errors: Record<string, string> | undefined;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorCode = err.code;
        errors = err instanceof AppError && err.statusCode === 422 ? err.errors : undefined; // Ensure validation errors are structured
    }
    // Mongoose Validation Error
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errors = Object.fromEntries(Object.entries((err as any).errors).map(([key, value]: [string, any]) => [key, value.message]));
    }
    // Mongoose Duplicate Key Error
    else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        statusCode = 409;
        message = 'Duplicate field value entered';
        errors = Object.fromEntries(
            Object.entries((err as any).keyValue).map(([key, value]) => [key, `${key} with value '${value}' already exists`])
        );
    }
    // JWT Errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Prepare API Response
    const errorResponse = {
        success: false,
        status: statusCode,
        message,
        ...(errorCode && { errorCode }),
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    res.status(statusCode).json(errorResponse);
};
