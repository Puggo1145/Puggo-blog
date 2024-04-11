import { 
    // NextRequestWithAuth, 
    withAuth 
} from "next-auth/middleware"

export default withAuth(
    async function middleware() {
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