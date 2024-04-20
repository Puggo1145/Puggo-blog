import { 
    // NextRequestWithAuth, 
    withAuth 
} from "next-auth/middleware"

export default withAuth(
    async function middleware() {
        console.log("url: " + process.env.NEXTAUTH_URL);
        console.log("secret: " + process.env.NEXTAUTH_SECRET);
        console.log("mongo: " +process.env.MONGODB_URI);
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
)

export const config = {
    matcher: [
        '/documents',
    ]
}