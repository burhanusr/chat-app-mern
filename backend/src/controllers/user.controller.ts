import { NextFunction, Request, Response } from 'express';

import { Controller } from '../decorators/controller.decorator';
import { MongoGet, MongoGetAll } from '../decorators/mongoose.decorator';
import { Route } from '../decorators/route.decorator';
import { protectRoute } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import User from '../models/user.model';
import { UpdateUserSchema, updateUserSchema } from '../schemas/user.schema';
import { uploadImageToCloudinary } from '../utils/cloudinary.util';
import { AppError } from '../utils/error.util';

/**
 * UserController handles all user-related routes.
 */
@Controller('/users')
class UserController {
    /**
     * Get all users.
     *
     * @route GET /users
     * @access Public
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @returns {Response} JSON response with all users.
     */
    @Route('get', '')
    @MongoGetAll(User)
    public getAll(req: Request, res: Response): Response {
        return res.status(200).json(req.mongoGetAll);
    }

    /**
     * Get a user by ID.
     *
     * @route GET /users/:id
     * @access Public
     * @param {Request} req - Express request object containing user ID.
     * @param {Response} res - Express response object.
     * @returns {Response} JSON response with user data.
     */
    @Route('get', '/:id')
    @MongoGet(User)
    public get(req: Request, res: Response): Response {
        return res.status(200).json(req.mongoGet);
    }

    /**
     * Update user profile.
     *
     * @route PATCH /users/update-profile
     * @access Private
     * @param {Request} req - Express request object containing user data.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     * @returns {Promise<Response | void>} JSON response with updated user data.
     */
    @Route('patch', '/update-profile', protectRoute, validate(updateUserSchema))
    public async updateProfile(req: Request<{}, {}, UpdateUserSchema>, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { profilePic } = req.body;
            const userId = req.user?._id;

            // Ensure user ID is available
            if (!userId) {
                return next(AppError.unauthorized('Unauthorized access'));
            }

            let imageUrl: string | undefined;
            if (profilePic) {
                imageUrl = await uploadImageToCloudinary(profilePic);
            }

            // Update user only if there are changes
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { ...(imageUrl && { profilePic: imageUrl }) }, // Update only if a new profilePic is provided
                { new: true, runValidators: true }
            ).select('-password'); // Exclude password from response

            if (!updatedUser) {
                return next(AppError.notFound('User not found'));
            }

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'Profile updated successfully',
                data: {
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    profilePic: updatedUser.profilePic
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
