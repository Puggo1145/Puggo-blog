import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/database";

import Document from "@/models/document";

interface DocumentBody {
    user_id: string;
}

export const GET = async (req: NextRequest) => {
    await connectToDB();

    try {
        const documents = await Document.find();

        return NextResponse.json(documents);
    } catch (err) {
        if ( err instanceof Error) {
            return NextResponse.json({ message: err.message }, { status: 401 });
        }
    }
}

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
            return NextResponse.json({ message: err.message }, { status: 401 });
        }
    }
};