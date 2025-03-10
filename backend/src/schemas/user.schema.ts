import { z } from 'zod';

export const updateUserSchema = z.object({
    // fullName: z.string().min(3, 'Name must be at least 3 characters').optional(),
    // email: z.string().email('Invalid email format').optional(),
    profilePic: z.string()
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
