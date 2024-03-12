import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import connectToDB from '@/utils/database';

import User from '@/models/user';

type RegisterBody = {
    username: string;
    password?: string | null;
}

// 注册和登录是自动完成的
export const POST = async (req: NextRequest) => {
    const { username, password } = await req.json() as RegisterBody;

    await connectToDB();

    const user = await User.findOne({ username: username });
    if (user && password) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json("Invalid username or password", { status: 401 });
        }
    }

    const encryptedPassword = password ? await bcrypt.hash(password, 5) : null;

    try {
        const newUser = await User.create({
            username,
            password: encryptedPassword
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(`error creating user: ${err}`, { status: 500 });
    };
}