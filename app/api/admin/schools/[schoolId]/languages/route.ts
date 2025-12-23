import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from '@/lib/verify';
import { NextRequest, NextResponse } from "next/server";

export const GET = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message || "Admin access required", status: 403 });
        }

        const user = auth.user;

        console.log("user", user.role)

        if (user.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Only Admin can add languages" }, { status: 403 });
        }

        const schoolId = (await params).schoolId;

        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            select: { languages: true },
        })

        if (!school) {
            return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, languages: school?.languages }, { status: 200 });
    } catch (error) {
        console.error("Language Fetch Error", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})