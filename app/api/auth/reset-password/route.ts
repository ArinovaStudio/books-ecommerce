import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = Wrapper(async(req: NextRequest) => {
    try {
        const body = await req.json();
        const { email, password }: { email: string, password: string } = body;

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 400 });
        }

        const hashedPassword = await hash(password, 12);

        await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
        return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 });
    } catch (error: any) {
        console.log(error.message);
        console.error(error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
});