import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.util';

/**
 * This function will check any data in the body of the request and compare it to a given schema to ensure the data is valid.
 * @param schema The data validation schema to check req.body against.
 * @returns An express request handler you can insert as middleware.
 */
export function validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // Extract error messages properly
            const formattedErrors = Object.entries(result.error.format()).reduce((acc, [key, value]) => {
                if (key !== '_errors') {
                    acc[key] = (value as { _errors?: string[] })._errors?.join(', ') || 'Invalid';
                }
                return acc;
            }, {} as Record<string, string>);

            return next(AppError.validationError(formattedErrors));
        }

        next();
    };
}
