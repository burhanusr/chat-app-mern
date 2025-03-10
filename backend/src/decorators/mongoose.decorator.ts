import { Request, Response, NextFunction } from 'express';
import mongoose, { Model } from 'mongoose';

/**
 * Decorator to retrieve all documents from a MongoDB model.
 * @param model Mongoose model used for querying.
 */
export function MongoGetAll(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const documents = await model.find();
                req.mongoGetAll = documents;
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}

/**
 * Decorator to retrieve a single document by ID from MongoDB.
 * @param model Mongoose model used for querying.
 */
export function MongoGet(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response) {
            try {
                const document = await model.findById(req.params.id);

                if (document) {
                    req.mongoGet = document;
                } else {
                    return res.status(400).json({ error: 'Not found' });
                }
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res);
        };

        return descriptor;
    };
}

/**
 * Decorator to create a new document in MongoDB.
 * @param model Mongoose model used for storage operations.
 */
export function MongoCreate(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response) {
            try {
                const document = new model({
                    _id: new mongoose.Types.ObjectId(),
                    ...req.body
                });

                await document.save();

                req.mongoCreate = document;
            } catch (error) {
                logging.error(error);

                res.status(400).json(error);
            }

            return originalMethod.call(this, req, res);
        };

        return descriptor;
    };
}

/**
 * Decorator to update a document in MongoDB by ID.
 * @param model Mongoose model used for update operations.
 */
export function MongoUpdate(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const document = await model.findById(req.params.id);

                if (!document) {
                    res.status(404).json({ message: 'not found' });
                }

                document.set({ ...req.body });

                await document.save();

                req.mongoUpdate = document;
            } catch (error) {
                logging.error(error);

                res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}

/**
 * Decorator to delete a document from MongoDB by ID.
 * @param model Mongoose model used for delete operations.
 */
export function MongoDelete(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const document = await model.findOneAndDelete({ _id: req.params.id });

                if (!document) res.sendStatus(404);
            } catch (error) {
                logging.error(error);

                res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}

/**
 * Decorator to perform a query based on the request body parameters.
 * @param model Mongoose model used for querying.
 */
export function MongoQuery(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const documents = await model.find({ ...req.body });
                req.mongoQuery = documents;
            } catch (error) {
                logging.error(error);

                res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
