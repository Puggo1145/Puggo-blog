"use server"

import bcrypt from "bcryptjs";

import connectToDB from "@/utils/database";
import User from "@/models/user";
// schema
import { LoginSchema } from "@/constants/zodSchema/auth";
// types
import { ZodError } from "zod";

export const loginAndRegister = async (
    { username, password }: Record<"username" | "password", string>
) => {
    try {
        await connectToDB();

        // validate
        LoginSchema.parse({ username, password });
        
        // check if user exists
        const user = await User
            .findOne({ username: username })
            .select("+password")
        if (!user) return { error: "Invalid username or password"  }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password!, user.password);
        if (!isPasswordCorrect) return { error: "Invalid username or password" }

        return { 
            ok: true,
            user: {
                id: user._id,
                username: user.username,
                avatar: user.avatar
            }
        };
    } catch (err) {
        if (err instanceof Error) {
            return { 
                error: err.message 
            }
        } else if (err instanceof ZodError) {
            return { 
                error: err.errors[0].message 
            }
        }

        return { error: "An error occurred" }
    }
}

// export const checkUser = async (username: string) => {
//     try {
//         await connectToDB();
    
//         const doesUserExists = await User.exists({ username: username });
        
//         if (doesUserExists) {
//             return { onRegister: false }
//         }
    
//         return { onRegister: true }
//     } catch (err) {
//         if (err instanceof Error) {
//             return { 
//                 error: err.message 
//             }
//         }
//     }
// }