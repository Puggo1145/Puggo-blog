import { z } from 'zod';

export const LoginSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters long"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    })
})