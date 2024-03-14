import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./app/(server)/api/auth/[...nextauth]/route";

export async function middleware(req: any, res: any) {
    const session = await getServerSession(authOptions);
    if (session) {
        NextResponse.next();
    } else {
        NextResponse.redirect("/api/auth/signin");
    }
};

export const config = {
    matcher: ['/api/documents']
}