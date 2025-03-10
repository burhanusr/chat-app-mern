import { Request, Response, NextFunction } from 'express';

import { Controller } from '../decorators/controller.decorator';
import { Route } from '../decorators/route.decorator';

/**
 * MainController handles general application routes.
 */
@Controller()
class MainController {
    /**
     * Health check endpoint to verify if the server is running.
     *
     * @route GET /
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next middleware function.
     * @returns {Response} JSON response indicating the health status.
     */
    @Route('get', '/')
    getHealthCheck(req: Request, res: Response, next: NextFunction): Response {
        logging.log('Healthcheck called successfully!');
        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Route healthy'
        });
    }
}

export default MainController;
