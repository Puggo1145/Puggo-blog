import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

import Document from "@/models/document";


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
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);
        const parentDocument = req.nextUrl.searchParams.get('parentDocument');

        const document = await Document.create({ 
            user_id: session?.user.id,
            parentDocument
        });
        return NextResponse.json(document._id, { status: 201 });
    } catch (err) {
        if ( err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }
};