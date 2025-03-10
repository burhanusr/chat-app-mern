import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import AuthController from './../../../src/controllers/auth.controller';
import User from './../../../src/models/user.model';
import { generateToken } from './../../../src/utils/jwt.util';
import { AppError } from './../../../src/utils/error.util';
import { signupSchema, loginSchema } from '../../../src/schemas/auth.schema';

jest.mock('./../../../src/models/user.model');
jest.mock('./../../../src/utils/jwt.util');

const mockRequest = (body: any) => ({ body } as Request);
const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    return res;
};
const mockNext = jest.fn() as NextFunction;

describe('AuthController', () => {
    let authController: AuthController;

    beforeEach(() => {
        authController = new AuthController();
        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('should register a user and return a token', async () => {
            const req = mockRequest({ fullName: 'John Doe', email: 'john@example.com', password: 'password123' });
            const res = mockResponse();

            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User.prototype.save as jest.Mock).mockResolvedValue({ _id: '123', fullName: 'John Doe', email: 'john@example.com', profilePic: '' });
            (generateToken as jest.Mock).mockReturnValue('mockToken');

            await authController.signup(req, res, mockNext);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(User.prototype.save).toHaveBeenCalled();
            expect(generateToken).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, token: 'mockToken' }));
        });

        it('should return an error if email already exists', async () => {
            const req = mockRequest({ fullName: 'John Doe', email: 'john@example.com', password: 'password123' });
            const res = mockResponse();

            (User.findOne as jest.Mock).mockResolvedValue({ email: 'john@example.com' });

            await authController.signup(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new AppError('Email already exists', 400));
        });
    });
});
