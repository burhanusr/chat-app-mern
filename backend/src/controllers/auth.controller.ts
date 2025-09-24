import { NextFunction, Request, Response } from 'express';

import { Controller } from '../decorators/controller.decorator';
import { Route } from '../decorators/route.decorator';
import { protectRoute } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import User from '../models/user.model';
import { loginSchema, signupSchema } from '../schemas/auth.schema';
import { AppError } from '../utils/error.util';
import { generateToken } from '../utils/jwt.util';
import { PRODUCTION } from '../config/config';

/**
 * Controller for authentication-related endpoints.
 */
@Controller('/auth')
class AuthController {
    /**
     * Handles user registration.
     *
     * @route POST /auth/signup
     * @middleware validate(signupSchema)
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    @Route('post', '/signup', validate(signupSchema))
    public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fullName, email, password } = req.body;

            // Check if user with the same email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw AppError.badRequest('Email already exists');
            }

            // Create new user
            const newUser = new User({
                fullName,
                email,
                password
            });

            generateToken(newUser, res);
            await newUser.save();

            res.status(201).json({
                success: true,
                status: 201,
                message: 'User registered successfully',
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handles user login.
     *
     * @route POST /auth/login
     * @middleware validate(loginSchema)
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    @Route('post', '/login', validate(loginSchema))
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            // Find user by email and include password field for verification
            const user = await User.findOne({ email }).select('+password');

            if (!user || !(await user.comparePassword(password, user.password))) {
                throw AppError.unauthorized('Invalid credentials');
            }

            generateToken(user, res);

            res.status(200).json({
                success: true,
                status: 200,
                message: `Welcome ${user.fullName}`,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handles user logout by clearing the JWT cookie.
     *
     * @route POST /auth/logout
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    @Route('post', '/logout')
    public logout(req: Request, res: Response, next: NextFunction): void {
        try {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: PRODUCTION ? 'none' : 'lax',
                secure: PRODUCTION
            });

            res.status(200).json({
                success: true,
                status: 200,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Checks if the user is authenticated.
     *
     * @route GET /auth/check
     * @middleware protectRoute
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     */
    @Route('get', '/check', protectRoute)
    public checkAuth(req: Request, res: Response, next: NextFunction): void {
        try {
            res.status(200).json({
                success: true,
                status: 200,
                message: 'User authenticated successfully',
                data: req.user
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
