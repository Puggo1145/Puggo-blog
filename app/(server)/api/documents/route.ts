import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/database";

import Document from "@/models/document";

type DocumentBody = {
    
}

export const POST = async (req: NextRequest) => {};