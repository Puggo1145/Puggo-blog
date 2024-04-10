import { POST } from "@/utils/request";

export const signInAndSignUp = async (
    credentials: Record<'username' | 'password', string> | undefined
) => await POST(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
    body: JSON.stringify({credentials})
})

export const checkUser = async (
    username: string
) => await POST("/api/auth/check-user", {
    body: JSON.stringify({ username })
})