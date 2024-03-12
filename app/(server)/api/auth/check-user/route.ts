import { NextRequest, NextResponse } from 'next/server';

import connectToDB from '@/utils/database';
import User from '@/models/user';

// 注册和登录是自动完成的
export const POST = async (req: NextRequest) => {
    const { username } = await req.json() as {username: string};

    await connectToDB();

    const doesUserExists = await User.exists({ username: username });
    
    if (doesUserExists) {
        return NextResponse.json("go login", { status: 200 });
    }

    return NextResponse.json({ error: "unexisted user" }, { status: 401 });
}