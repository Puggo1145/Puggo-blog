import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    secret: process.env.SECRET,
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                });

                if (res.status === 201 || res.status === 200) {
                    const user = await res.json();

                    return {
                        id: user._id,
                        name: user.username,
                        image: user.avatar
                    };
                } else {
                    return null;
                }
            },
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },
        async session({session, token}) {
            session.user.id = token.id;

            return session;
        }
    },
    pages: {
        signIn: '/login'
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };