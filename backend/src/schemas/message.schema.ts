import { z } from 'zod';

export const messageSchema = z
    .object({
        text: z.string().optional(), // Text is optional if image exists
        image: z.string().optional() // Image URL (base64 or actual URL)
    })
    .refine((data) => data.text || data.image, {
        message: 'Message must contain either text or an image'
    });
