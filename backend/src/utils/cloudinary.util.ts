import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

export const uploadImageToCloudinary = async (image: string): Promise<string> => {
    try {
        const uploadResponse: UploadApiResponse = await cloudinary.uploader.upload(image, {
            folder: 'chat-apps',
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });
        return uploadResponse.secure_url;
    } catch (error) {
        throw new Error('Image upload failed');
    }
};
