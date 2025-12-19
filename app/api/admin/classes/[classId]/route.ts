import { Wrapper } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/verify";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const updateClassValidation = z.object({
  name: z.string().optional(),
  sections: z.array(z.string()).optional(),
  academicYear: z.string().optional()
});

export const PUT = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success){
            return NextResponse.json({ success: false, message: "Admin access required", status: 403 });
        }

        const body = await req.json();

        const validation = updateClassValidation.safeParse(body);
        if (!validation.success) {
            const errors = validation.error.errors.map((error) => ({ field: error.path[0], message: error.message }));;
            return NextResponse.json({ success: false, message: "Vlidation error", errors }, { status: 400 });
        }

        const { name, sections, academicYear } = validation.data;
        const { classId } = await params;

        const existingClass = await prisma.class.findUnique({ where: { id: classId }});

        if (!existingClass) {
            return NextResponse.json( { success: false, message: "Class not found" }, { status: 404 });
        }

        // Sub admin check
        if (auth.user.role === "SUB_ADMIN") {
            if (!auth.user.schoolId || auth.user.schoolId !== existingClass.schoolId) {
                return NextResponse.json({ success: false, message: "You can only edit classes in your own school" }, { status: 403 });
            }
        }

        // Duplicate name check
        if (name) {
            const duplicate = await prisma.class.findFirst({
                where: {
                    schoolId: existingClass.schoolId,
                    name: { equals: name, mode: "insensitive" },
                    academicYear: academicYear || existingClass.academicYear,
                    id: { not: classId }
                }
            });

            if (duplicate) {
                return NextResponse.json({ success: false, message: "A class with this name already exists for this year" }, { status: 409 });
            }
        }

        const updatedClass = await prisma.class.update({ where: { id: classId }, data: { name, sections, academicYear }});

        return NextResponse.json( { success: true, message: "Class updated successfully", class: updatedClass }, { status: 200 });

    } catch (error) {
        console.error("Update Class Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})

export const DELETE = Wrapper(async (req: NextRequest, { params }: { params: Promise<{ classId: string }> }) => {
    try {
        const auth = await verifyAdmin(req);

        if (!auth.success){
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

        // Sub admin check
        if (auth.user.role === "SUB_ADMIN") {
            if (!auth.user.schoolId || auth.user.schoolId !== existingClass.schoolId) {
                return NextResponse.json({ success: false, message: "You can only edit classes in your own school" }, { status: 403 });
            }
        }

        const schoolId = existingClass.schoolId;

        await prisma.$transaction(async (tx) => {
            await tx.class.delete({ where: { id: classId }});

            await tx.school.update({ where: { id: schoolId }, data: { numberOfClasses: { decrement: 1 } } });
        })
        
        return NextResponse.json({ success: true, message: "Class deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete Class Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
})