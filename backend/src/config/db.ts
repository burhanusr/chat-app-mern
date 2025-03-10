import mongoose from 'mongoose';
import { mongo } from './config';

export const connectDB = async (): Promise<void> => {
    try {
        const connection = await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
        logging.log('Connected to Mongo: ', connection.version);
    } catch (error) {
        logging.log('Unable to Connect to Mongo:');
        logging.error(error);
    }
};
