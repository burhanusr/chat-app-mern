import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import path from 'path';

import { setupCloudinary } from './config/cloudinary';
import { connectDB } from './config/db';
import { app } from './config/socket';
import AuthController from './controllers/auth.controller';
import MainController from './controllers/main.controller';
import MessageController from './controllers/message.controller';
import UserController from './controllers/user.controller';
import { errorHandler } from './middlewares/error.middleware';
import { loggingHandler } from './middlewares/logging.middleware';
import { declareHandler } from './middlewares/mongoose.middleware';
import { RouteHandler, RouteHandlers } from './types/routes.type';
import { AppError } from './utils/error.util';
import { FRONTEND_BASEURL } from './config/config';

/**
 * Main application class to initialize the Express server, configure middleware,
 * setup routes, and handle errors.
 */
export default class App {
    /** Express application instance */
    public app: Express = app;

    /** Base API route prefix */
    private readonly baseRoute = '/api/v1';

    /**
     * Initializes the application by setting up configurations and middleware.
     */
    constructor() {
        setupCloudinary();
        this.configureMiddleware();
        this.configureRoutes([MainController, AuthController, UserController, MessageController]);
        this.configureErrorHandling(errorHandler);
    }

    /**
     * Configures middleware for security, logging, body parsing, and static file serving.
     */
    private configureMiddleware(): void {
        // Security middleware
        this.app.use(helmet());
        this.app.use(
            cors({
                origin: FRONTEND_BASEURL,
                credentials: true
            })
        );

        // Logging middleware
        this.app.use(loggingHandler);
        this.app.use(declareHandler);

        // Body parsing middleware
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(cookieParser());
    }

    /**
     * Configures application routes by dynamically registering controllers and their handlers.
     * @param {Array<any>} controllers - List of controller classes to register routes for.
     */
    private configureRoutes(controllers: any[]): void {
        // logging.log('--------------------------------------------');
        // logging.log('Define Routes');
        // logging.log('--------------------------------------------');

        for (const Controller of controllers) {
            const controller = new Controller();

            const routeHandlers: RouteHandlers = Reflect.getMetadata('routeHandlers', controller);
            const controllerPath: string = Reflect.getMetadata('baseRoute', controller.constructor);
            const methods = Array.from(routeHandlers.keys());

            for (const method of methods) {
                const routes: RouteHandler | undefined = routeHandlers.get(method);

                if (routes) {
                    for (const routePath of routes.keys()) {
                        const handlers = routes.get(routePath);

                        if (handlers) {
                            this.app[method](this.baseRoute + controllerPath + routePath, handlers);
                            // logging.log('Loading route: ', method, this.baseRoute + controllerPath + routePath);
                        }
                    }
                }
            }
        }

        // logging.log('--------------------------------------------');
    }

    /**
     * Configures global error handling including a 404 handler and a general error handler.
     * @param {ErrorRequestHandler} globalErrorHandler - The global error handler middleware.
     */
    private configureErrorHandling(globalErrorHandler: ErrorRequestHandler): void {
        // Route not found (404) handler
        this.app.all(`${this.baseRoute}/*`, (req: Request, res: Response, next: NextFunction) => {
            next(AppError.notFound(`API route ${req.originalUrl} not found`));
        });

        // Global error handler
        this.app.use(globalErrorHandler);
    }

    /**
     * Connects the application to the database.
     * @returns {Promise<void>} A promise that resolves when the database connection is established.
     */
    public async connectDatabase(): Promise<void> {
        await connectDB();
    }
}
