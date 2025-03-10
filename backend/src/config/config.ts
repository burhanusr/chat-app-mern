import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';

const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = process.env.MONGO_URL || '';
const MONGO_DATABASE = process.env.MONGO_DATABASE || '';
const MONGO_OPTIONS: mongoose.ConnectOptions = { retryWrites: true, w: 'majority', appName: 'Cluster0' };

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

export const JWT_SECRET = process.env.JWT_SECRET || '';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

export const FRONTEND_BASEURL = process.env.FRONTEND_BASEURL || '';

export const mongo = {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_URL,
    MONGO_DATABASE,
    MONGO_OPTIONS,
    MONGO_CONNECTION: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DATABASE}`
};

export const server = {
    SERVER_HOSTNAME,
    PORT
};

export const cloud = {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
};
