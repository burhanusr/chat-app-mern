import { NextFunction, Request, Response } from 'express';

import { Controller } from '../decorators/controller.decorator';
import { Route } from '../decorators/route.decorator';
import { protectRoute } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import Message, { IMessageDocument } from '../models/message.model';
import User from '../models/user.model';
import { messageSchema } from '../schemas/message.schema';
import { uploadImageToCloudinary } from '../utils/cloudinary.util';
import { AppError } from '../utils/error.util';
import { getReceiverSocketId, io } from '../config/socket';

/**
 * MessageController handles all message-related routes.
 */
@Controller('/messages')
class MessageController {
    /**
     * Get all users except the logged-in user for the sidebar.
     *
     * @route GET /messages/users
     * @access Public
     * @param {Request} req - Express request object containing user data.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     * @returns {Promise<Response>} JSON response with user list.
     */
    @Route('get', '/users', protectRoute)
    public async getUsersForSidebar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const loggedInUserId = req.user?._id;
            const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-__v');

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'Get user successfully',
                data: filteredUsers
            });
        } catch (error) {
            logging.log('Error in getUsersForSidebar Controller: ');
            logging.error(error);
            next(error);
        }
    }

    /**
     * Get all messages between the logged-in user and a specified receiver.
     *
     * @route GET /messages/:receiverId
     * @access Public
     * @param {Request} req - Express request object containing user data and receiver ID.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     * @returns {Promise<Response>} JSON response with messages.
     */
    @Route('get', '/:receiverId', protectRoute)
    public async getMessages(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userToChatId: string = req.params.receiverId;
            const myId: string | undefined = req.user?._id?.toString();

            if (!myId) {
                return next(AppError.unauthorized('Unauthorized access'));
            }

            const messages: IMessageDocument[] = await Message.find({
                $or: [
                    { senderId: myId, receiverId: userToChatId },
                    { senderId: userToChatId, receiverId: myId }
                ]
            });

            return res.status(200).json({
                success: true,
                status: 200,
                message: 'Get all messages successfully',
                data: messages
            });
        } catch (error) {
            logging.log('Error in getMessages Controller: ');
            logging.error(error);
            next(error);
        }
    }

    /**
     * Send a message to a specific user.
     *
     * @route POST /messages/send/:receiverId
     * @access Public
     * @param {Request} req - Express request object containing user data and message details.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     * @returns {Promise<Response>} JSON response with the sent message.
     */
    @Route('post', '/send/:receiverId', protectRoute, validate(messageSchema))
    public async sendMessage(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { text, image } = messageSchema.parse(req.body);
            const { receiverId } = req.params;
            const senderId = req.user?._id;

            const imageUrl = image ? await uploadImageToCloudinary(image) : undefined;

            const newMessage = await Message.create({ senderId, receiverId, text, image: imageUrl });

            // Emit real-time message event if the receiver is online
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }

            return res.status(201).json({
                success: true,
                status: 201,
                message: 'Message sent successfully',
                data: newMessage
            });
        } catch (error) {
            logging.error('Error in sendMessage Controller:', error);
            next(error);
        }
    }
}

export default MessageController;
