import { NextFunction, Request, Response } from 'express';
import User, { IUserDocument } from './../models/user.model';
import { AppError } from '../utils/error.util';
import { verifyToken } from '../utils/jwt.util';

declare global {
    namespace Express {
        interface Request {
            user: IUserDocument | undefined;
        }
    }
}

interface JwtPayload {
    userId: string;
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the token from cookies
        const token = req.cookies.jwt;

        if (!token) {
            return next(AppError.unauthorized('No token provided'));
        }

        // Verify and decode the token using the utility function
        const decoded = verifyToken<JwtPayload>(token);

        if (!decoded) {
            return next(AppError.unauthorized('Invalid token'));
        }

        // Check if the user exists in the database
        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(AppError.unauthorized('User not found'));
        }

        // Attach the user to the request object
        req.user = user;

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        next(error); // Pass any errors to the global error handler
    }
};
