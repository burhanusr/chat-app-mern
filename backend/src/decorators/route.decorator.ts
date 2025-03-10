import { Express, RequestHandler } from 'express';
import { RouteHandlers } from '../types/routes.type';

/**
 * `@Route` Decorator for defining route handlers in an Express application.
 *
 * This decorator registers a method as a route handler for a specified HTTP method and path.
 * It also allows adding optional middleware to the route.
 *
 * @param {keyof Express} method - The HTTP method (e.g., 'get', 'post', 'put', 'delete', etc.).
 * @param {string} [path=''] - The route path (defaults to an empty string, meaning the base route).
 * @param {...RequestHandler[]} middleware - Optional Express middleware functions to be executed before the route handler.
 *
 * @returns {MethodDecorator} - A method decorator that registers the function as a route handler.
 *
 * @example
 * ```typescript
 * import { Route } from '../decorators/route.decorator';
 * import { Request, Response } from 'express';
 *
 * class UserController {
 *   @Route('get', '/users')
 *   getUsers(req: Request, res: Response) {
 *     res.json({ message: 'Fetching users' });
 *   }
 *
 *   @Route('post', '/users', authenticationMiddleware)
 *   createUser(req: Request, res: Response) {
 *     res.json({ message: 'User created' });
 *   }
 * }
 * ```
 */

export function Route(method: keyof Express, path: string = '', ...middleware: RequestHandler[]): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const routePath = path;
        const routeHandlers: RouteHandlers = Reflect.getMetadata('routeHandlers', target) || new Map();

        if (!routeHandlers.has(method)) {
            routeHandlers.set(method, new Map());
        }

        routeHandlers.get(method)?.set(routePath, [...middleware, descriptor.value]);

        Reflect.defineMetadata('routeHandlers', routeHandlers, target);
    };
}
