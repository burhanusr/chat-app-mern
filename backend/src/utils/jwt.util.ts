import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { JWT_SECRET, PRODUCTION } from '../config/config';
import { AppError } from './error.util';

export const generateToken = (userData: any, res: Response): string => {
    const token = jwt.sign({ userId: userData._id }, JWT_SECRET, {
        expiresIn: '1d'
    });

    console.log(token);

    res.cookie('jwt', token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: PRODUCTION ? 'none' : 'lax', // use 'none' when in production because it need secure to be true
        secure: PRODUCTION
    });

    return token;
};

export const verifyToken = <T>(token: string): T => {
    try {
        // Verify the token and return the decoded payload
        const decoded = jwt.verify(token, JWT_SECRET) as T;

        return decoded;
    } catch (error) {
        throw AppError.unauthorized('Token verification failed');
    }
};
