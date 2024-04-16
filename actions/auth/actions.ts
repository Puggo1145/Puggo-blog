"use server"

import bcrypt from "bcryptjs";

import connectToDB from "@/utils/database";
import User from "@/models/user";

import { z } from "zod";

export const loginAndRegister = async (
    { username, password }: Record<"username" | "password", string | null>
) => {
    await connectToDB();

    // vaidation
    const authSchema = z.object({
        username: z.string().min(4).max(20),
        password: z.string().min(8).max(100)
    });

    try {
        authSchema.parse({ username, password });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return { 
                ok: false, 
                error: err.errors[0].message 
            }
        }
    }

    const user = await User
        .findOne({ username: username })
        .select("+password")

    if (user && password) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            return { 
                ok: true,
                user
            };
        } else {
            return { 
                ok: false, 
                error: "Invalid username or password" 
            }
        }
    } else if (!user) {
        const encryptedPassword = password ? await bcrypt.hash(password, 5) : null;

        try {
            const user = await User.create({
                username,
                password: encryptedPassword
            });

            return { 
                ok: true,
                user
            };
        } catch (err) {
            if (err instanceof Error) {
                return { 
                    ok: false, 
                    error: err.message 
                }
            }
        }
    }
}

export const checkUser = async (username: string) => {
    try {
        await connectToDB();
    
        const doesUserExists = await User.exists({ username: username });
        
        if (doesUserExists) {
            return { onRegister: false }
        }
    
        return { onRegister: true }
    } catch (err) {
        if (err instanceof Error) {
            return { 
                error: err.message 
            }
        }
    }
}