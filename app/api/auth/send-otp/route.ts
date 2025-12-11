import sendEmail from "@/lib/email";
import prisma from "@/lib/prisma";
import { emailOtpTemplate } from "@/lib/templates";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const body = await req.json();

        const { email } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiredAt = new Date(Date.now() + 2 * 60 * 1000); // 2min

        await prisma.otp.deleteMany({ where: { email } });

        await prisma.otp.create({ data: { email, otp, expiredAt } });

        const { subject, html } = emailOtpTemplate(otp);

        const isSend = await sendEmail(email, subject, html);

        if (!isSend) {
            return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "OTP sent successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}