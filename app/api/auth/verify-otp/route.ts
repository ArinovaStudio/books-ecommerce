import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, otp }: { email: string, otp: string } = body;

        if (!email || !otp) {
            return NextResponse.json({ success: false, message: "Email and OTP are required" }, { status: 400 });
        }

        const record = await prisma.otp.findFirst({ where: { email }});

        if (!record || record.otp !== otp) {
            return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
        }

        const now = new Date();
        if (now > record.expiredAt) {
            await prisma.otp.delete({ where: { id: record.id } });
            return NextResponse.json({ success: false, message: "OTP has expired." }, { status: 400 });
        }

        await prisma.otp.delete({ where: { id: record.id } });

        return NextResponse.json({ success: true, message: "Email verified successfully" }, { status: 200 });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}