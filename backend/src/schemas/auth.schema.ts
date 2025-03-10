import { z } from 'zod';

export const signupSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    profilePic: z.string().optional()
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
