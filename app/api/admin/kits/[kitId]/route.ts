import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify-admin";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { kitId: string } }){
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success){
            return NextResponse.json({ success: false, message: "Admin access required", status: 403 });
        }

        const { kitId } = await params;

        if (!kitId){
            return NextResponse.json({ success: false, message: "Kit ID is required" }, { status: 400 });
        }

        const existingKit = await prisma.kit.findUnique({ where: { id: kitId }});

        if (!existingKit){
            return NextResponse.json({ success: false, message: "Kit not found" }, { status: 404 });
        }

        await prisma.kitItem.deleteMany({ where: { kitId } });

        await prisma.kit.delete({ where: { id: kitId }});
        
        return NextResponse.json({ success: true, message: "Kit deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Kit delete error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}