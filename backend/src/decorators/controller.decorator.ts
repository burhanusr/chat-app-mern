/**
 * A decorator function that assigns a base route to a controller class.
 *
 * @param {string} [baseRoute=''] - The base route path for the controller. Defaults to an empty string.
 * @returns {ClassDecorator} - A class decorator that defines metadata for the base route.
 *
 * @example
 * ```typescript
 * @Controller('/users')
 * class UserController {
 *   // Controller logic here
 * }
 * ```
 */

export function Controller(baseRoute: string = ''): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('baseRoute', baseRoute, target);
    };
}
