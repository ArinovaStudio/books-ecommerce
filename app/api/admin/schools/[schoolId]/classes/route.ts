import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

export const GET = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { schoolId } = await params;

        if (!schoolId) {
            return NextResponse.json({ success: false, message: "School ID is required" }, { status: 400 });
        }

        const classes = await prisma.class.findMany({
            where: { schoolId },
            select: { id: true, name: true }
        });

        return NextResponse.json({ success: true, classes }, { status: 200 });

    } catch (error) {
        console.error("Fetch Classes Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
});