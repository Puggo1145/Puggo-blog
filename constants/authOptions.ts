import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
// server action
import { loginAndRegister } from '@/actions/auth/actions';

const authOptions: AuthOptions = {
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
                const res = await loginAndRegister(credentials!);

                if (res?.ok) {
                    const user = await res.user;

                    return {
                        id: user.id,
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

export default authOptions;