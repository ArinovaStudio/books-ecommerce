import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ queryId: string }> }) => {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.success || auth.user.role !== "ADMIN") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { queryId } = await params;

    const existingQuery = await prisma.contactQuery.findUnique({
        where: { id: queryId }
    });

    if (!existingQuery) {
        return NextResponse.json({ success: false, message: "Contact query not found" }, { status: 404 });
    }

    await prisma.contactQuery.delete({ where: { id: queryId }});

    return NextResponse.json({ success: true, message: "Contact query deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete Query Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
});