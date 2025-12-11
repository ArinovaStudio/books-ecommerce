import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify-admin";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const updateClassValidation = z.object({
  name: z.string().optional(),
  sections: z.array(z.string()).optional()
});

export async function PUT(req: NextRequest, { params }: { params: { classId: string } }) {
    try {
        const auth = await verifyAdmin(req);

        if (!auth){
            return NextResponse.json({ success: false, message: "Admin access required", status: 403 });
        }

        const body = await req.json();

        const validation = updateClassValidation.safeParse(body);
        if (!validation.success) {
            const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));;
            return NextResponse.json({ success: false, message: "Vlidation error", errors }, { status: 400 });
        }

        const { name, sections } = validation.data;
        const { classId } = await params;

        const existingClass = await prisma.class.findUnique({ where: { id: classId }});

        if (!existingClass) {
            return NextResponse.json( { success: false, message: "Class not found" }, { status: 404 });
        }

        const updatedClass = await prisma.class.update({ where: { id: classId }, data: { name, sections }});

        return NextResponse.json( { success: true, message: "Class updated successfully", class: updatedClass }, { status: 200 });

    } catch (error) {
        console.error("Update Class Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { classId: string } }){
    try {
        const auth = await verifyAdmin(req);

        if (!auth){
            return NextResponse.json({ success: false, message: "Admin access required", status: 403 });
        }

        const { classId } = await params;

        if (!classId) {
            return NextResponse.json({ success: false, message: "Class ID is required" }, { status: 400 });
        }

        const existingClass = await prisma.class.findUnique({ where: { id: classId }});

        if (!existingClass) {
            return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
        }

        await prisma.class.delete({ where: { id: classId }});

        return NextResponse.json({ success: true, message: "Class deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete Class Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}