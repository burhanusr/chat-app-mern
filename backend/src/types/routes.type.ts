import { Express, RequestHandler } from 'express';

export type RouteHandlers = Map<keyof Express, Map<string, RequestHandler[]>>;
export type RouteHandler = Map<string, RequestHandler[]>;
