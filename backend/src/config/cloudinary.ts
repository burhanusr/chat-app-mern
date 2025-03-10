import { v2 as cloudinary } from 'cloudinary';
import { cloud } from './config';

const setupCloudinary = (): void => {
    cloudinary.config({
        cloud_name: cloud.CLOUDINARY_CLOUD_NAME,
        api_key: cloud.CLOUDINARY_API_KEY,
        api_secret: cloud.CLOUDINARY_API_SECRET
    });
};

export { cloudinary, setupCloudinary };
