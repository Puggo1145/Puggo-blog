import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

import Document from "@/models/document";

interface DocumentBody {
    user_id: string;
}

// export const GET = async (req: NextRequest) => {
//     await connectToDB();

//     try {
//         const documents = await Document.find();

//         return NextResponse.json(documents);
//     } catch (err) {
//         if ( err instanceof Error) {
//             return NextResponse.json({ message: err.message }, { status: 401 });
//         }
//     }
// }

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);
        const parentDocument = req.nextUrl.searchParams.get('parentDocument');

        const documents = await Document
            .find({ 
                user_id: session?.user.id,
                parentDocument
            })
            .select('-isArchived')
            .sort({ createdAt: -1 });

        return NextResponse.json(documents, { status: 200 });

    } catch (err) {
        if ( err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }
};

export const POST = async (req: NextRequest) => {
    const { user_id } = await req.json() as DocumentBody;

    await connectToDB();

    try {
        const newDocument = await Document.create({ user_id: user_id });

        return NextResponse.json({ 
            message: "Document created",
            document: newDocument
        }, { status: 201 });
    } catch (err) {
        if ( err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }
};